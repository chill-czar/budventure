import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimistic, useTransition, useMemo } from 'react';
import { tasksAPI } from '../api/tasks';
import { useDebouncedValue } from './useDebouncedValue';

export const useTasks = (filters = {}) => {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  // Debounce filter changes for smooth UX (but no API calls!)
  const debouncedFilters = useDebouncedValue(filters, 300);

  // Always fetch ALL tasks - no filtering at API level
  const queryKey = useMemo(() => ['tasks'], []);

  // Main tasks query - fetches everything always
  const {
    data: tasksData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => tasksAPI.getTasks({}),  // No filters - get everything!
    refetchInterval: 30 * 1000,  // Auto-refresh every 30s
    staleTime: 10 * 1000,         // Consider fresh for 10s
    refetchOnWindowFocus: false,  // Performance optimization
  });

  // Optimistic updates state management
  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    tasksData?.data || [],
    (currentState, action) => {
      switch (action.type) {
        case 'ADD':
          return [action.task, ...currentState];
        case 'UPDATE':
          return currentState.map(task =>
            task._id === action.taskId
              ? { ...task, ...action.updates }
              : task
          );
        case 'DELETE':
          return currentState.filter(task => task._id !== action.taskId);
        case 'ROLLBACK_ADD':
          return currentState.filter(task => task._id !== action.tempId);
        case 'ROLLBACK_UPDATE':
          return currentState.map(task =>
            task._id === action.taskId ? action.originalTask : task
          );
        case 'ROLLBACK_DELETE':
          return [...currentState, action.deletedTask];
        default:
          return currentState;
      }
    }
  );

  // Client-side filtering logic - instant, no API calls!
  const filteredTasks = useMemo(() => {
    let filtered = optimisticTasks;

    // Filter by status
    if (debouncedFilters.status) {
      filtered = filtered.filter(task => task.status === debouncedFilters.status);
    }

    // Filter by priority
    if (debouncedFilters.priority) {
      filtered = filtered.filter(task => task.priority === debouncedFilters.priority);
    }

    // Full-text search across title and description
    if (debouncedFilters.search?.trim()) {
      const searchTerm = debouncedFilters.search.toLowerCase().trim();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [optimisticTasks, debouncedFilters]);

  // CREATE TASK - Optimistic
  const createTaskMutation = useMutation({
    mutationFn: tasksAPI.createTask,
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Create optimistic task with temp ID
      const optimisticTask = {
        ...newTask,
        _id: `temp-${Date.now()}`,
        status: newTask.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add to UI
      startTransition(() => {
        updateOptimisticTasks({
          type: 'ADD',
          task: optimisticTask,
          tempId: optimisticTask._id,
        });
      });

      return { optimisticTask };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      startTransition(() => {
        updateOptimisticTasks({
          type: 'ROLLBACK_ADD',
          tempId: context.optimisticTask._id,
        });
      });
    },
    onSettled: () => {
      // Always invalidate to sync with server
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // UPDATE TASK - Optimistic
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }) => tasksAPI.updateTask(taskId, updates),
    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey });

      // Store original task for rollback
      const currentTask = optimisticTasks.find(t => t._id === taskId);

      // Optimistically update
      startTransition(() => {
        updateOptimisticTasks({
          type: 'UPDATE',
          taskId,
          updates: {
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      });

      return { currentTask };
    },
    onError: (error, variables, context) => {
      // Rollback to original
      startTransition(() => {
        updateOptimisticTasks({
          type: 'ROLLBACK_UPDATE',
          taskId: variables.taskId,
          originalTask: context.currentTask,
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // DELETE TASK - Optimistic
  const deleteTaskMutation = useMutation({
    mutationFn: tasksAPI.deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey });

      // Store deleted task for rollback
      const deletedTask = optimisticTasks.find(t => t._id === taskId);

      // Optimistically remove
      startTransition(() => {
        updateOptimisticTasks({
          type: 'DELETE',
          taskId,
        });
      });

      return { deletedTask };
    },
    onError: (error, taskId, context) => {
      // Restore deleted task
      startTransition(() => {
        updateOptimisticTasks({
          type: 'ROLLBACK_DELETE',
          deletedTask: context.deletedTask,
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // Combined mutation loading states
  const isCreating = createTaskMutation.isPending;
  const isUpdating = useMemo(() =>
    updateTaskMutation.isPending, [updateTaskMutation.isPending]
  );
  const isDeleting = useMemo(() =>
    deleteTaskMutation.isPending, [deleteTaskMutation.isPending]
  );

  // Helper functions for checking specific operations
  const updatingTaskId = updateTaskMutation.variables?.taskId || null;
  const deletingTaskId = deleteTaskMutation.variables || null;

  return {
    // Data - use optimistic for instant UI updates
    tasks: optimisticTasks,
    filteredTasks, // ✅ Client-filtered tasks - no API calls!
    serverTasks: tasksData?.data || [],

    // State
    isLoading,
    error,

    // Filters
    filters: debouncedFilters,

    // Actions (all optimistic)
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,

    // Individual loading states
    isCreating,
    isUpdating: (taskId) => isUpdating && updatingTaskId === taskId,
    isDeleting: (taskId) => isDeleting && deletingTaskId === taskId,

    // Utility
    refetch,

    // Pagination (pass through)
    pagination: tasksData?.pagination,
  };
};
