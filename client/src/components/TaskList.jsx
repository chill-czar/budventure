import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { tasksAPI } from '../api/tasks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import TaskItem from './TaskItem';

const TaskSkeleton = React.memo(() => (
  <ul className="divide-y divide-gray-200">
    {[...Array(5)].map((_, i) => (
      <li key={i} className="p-6">
        <div className="animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
));

TaskSkeleton.displayName = 'TaskSkeleton';

const TaskList = ({ onEditTask, onTaskChange, refreshTrigger = 0 }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  const [tasksData, setTasksData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const debouncedFilters = useDebouncedValue(filters, 300);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksAPI.getTasks(debouncedFilters);
      setTasksData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedFilters]);

  // Refresh tasks when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchTasks();
    }
  }, [refreshTrigger, fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [debouncedFilters, fetchTasks]);

  const handleFilterChange = useCallback((e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  }, [filters]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const originalTasks = tasksData;

      // Optimistically remove task from UI
      setTasksData(prev => ({
        ...prev,
        data: prev.data.filter(task => task._id !== taskId)
      }));

      try {
        setDeletingTaskId(taskId);
        await tasksAPI.deleteTask(taskId);
        // Notify parent component to refresh stats
        if (onTaskChange) onTaskChange();
      } catch (err) {
        // Revert optimistic update on error
        setTasksData(originalTasks);
        alert('Error deleting task: ' + (err.response?.data?.message || 'Unknown error'));
      } finally {
        setDeletingTaskId(null);
      }
    }
  }, [tasksData, onTaskChange]);

  const handleStatusChange = useCallback(async (taskId, newStatus) => {
    const originalTasks = tasksData;

    // Optimistically update task status in UI
    setTasksData(prev => ({
      ...prev,
      data: prev.data.map(task =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    }));

    try {
      setUpdatingTaskId(taskId);
      await tasksAPI.updateTask(taskId, { status: newStatus });
      // Notify parent component to refresh stats
      if (onTaskChange) onTaskChange();
    } catch (err) {
      // Revert optimistic update on error
      setTasksData(originalTasks);
      alert('Error updating task: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setUpdatingTaskId(null);
    }
  }, [tasksData, onTaskChange]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Tasks Skeleton */}
        <div className="bg-white shadow rounded-lg">
          <TaskSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const tasks = tasksData?.data || [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white shadow rounded-lg">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No tasks found. Create your first task!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={onEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                updatingId={updatingTaskId}
                deletingId={deletingTaskId}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Info */}
      {tasksData?.pagination && (
        <div className="text-center text-sm text-gray-500">
          Showing {tasks.length} of {tasksData.pagination.totalItems} tasks
          (Page {tasksData.pagination.currentPage} of {tasksData.pagination.totalPages})
        </div>
      )}
    </div>
  );
};

export default TaskList;
