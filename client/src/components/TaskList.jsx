import { useState } from "react";
import React from "react";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";

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

TaskSkeleton.displayName = "TaskSkeleton";

const TaskList = ({ onEditTask }) => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    limit: "10", // Default 10 items per page
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Uses optimistic filtering - instant updates, no API calls!
  const {
    tasks, // Full collection for operations
    filteredTasks, // Client-filtered results - instant!
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
  } = useTasks(filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });

    // Reset to page 1 when filters change (except limit)
    if (name !== 'limit') {
      setCurrentPage(1);
    }
  };

  // Client-side pagination logic
  const totalFilteredItems = filteredTasks.length;
  const limitNum = parseInt(filters.limit);
  const totalPages = Math.ceil(totalFilteredItems / limitNum);
  const startIndex = (currentPage - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        // ✅ Task disappears instantly, then syncs with server
      } catch (error) {
        alert("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask({ taskId, updates: { status: newStatus } });
      // ✅ Status changes instantly with optimistic update
    } catch (error) {
      alert("Failed to update task status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Filters Skeleton */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        {error.message || "Error fetching tasks"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Items per page
            </label>
            <select
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List - Uses paginated results */}
      <div className="bg-white shadow rounded-lg">
        {paginatedTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {tasks.length === 0
              ? "No tasks found. Create your first task!"
              : "No tasks match your filters."}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {paginatedTasks.map(
              (
                task // ✅ Render paginated tasks - instant!
              ) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  updating={isUpdating(task._id)}
                  deleting={isDeleting(task._id)}
                />
              )
            )}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
      {totalFilteredItems > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 px-2">
          {/* Previous Button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border rounded-md mr-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Page</span>
            <select
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              className="px-3 py-2 text-sm border rounded-md bg-white"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
            <span className="text-sm text-gray-700">of {totalPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border rounded-md ml-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Showing {paginatedTasks.length} of {totalFilteredItems} filtered tasks
        {totalFilteredItems > limitNum && (
          <span> (Page {currentPage} of {totalPages})</span>
        )}
      </div>
    </div>
  );
};

export default TaskList;
