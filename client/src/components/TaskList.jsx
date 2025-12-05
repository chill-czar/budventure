import { useState } from "react";
import React from "react";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

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

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

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
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Skeleton */}
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-64" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-8 w-14" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error.message || "Error fetching tasks"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Filter Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={filters.priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              name="search"
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limit">Items per page</Label>
            <Select
              value={filters.limit}
              onValueChange={(value) => handleFilterChange('limit', value)}
            >
              <SelectTrigger id="limit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

      {/* Tasks List - Uses paginated results */}
      <Card>
        <CardContent className="p-0">
          {paginatedTasks.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {tasks.length === 0
                ? "No tasks found. Create your first task!"
                : "No tasks match your filters."}
            </div>
          ) : (
            <ul className="divide-y">
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
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalFilteredItems > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 px-2 gap-4">
          <Button
            variant="outline"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Page</span>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => goToPage(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <SelectItem key={page} value={page.toString()}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
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
