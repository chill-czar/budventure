import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TaskItem = React.memo(({ task, onEdit, onDelete, onStatusChange, updatingId, deletingId }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <li className="p-6 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{task.title}</h3>
            <Badge variant={getPriorityVariant(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant={getStatusVariant(task.status)}>
              {task.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            {task.tags.length > 0 && (
              <span className="ml-4">Tags: {task.tags.join(', ')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={task.status}
            onValueChange={(value) => onStatusChange(task._id, value)}
            disabled={updatingId === task._id}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task._id)}
            disabled={deletingId === task._id}
          >
            {deletingId === task._id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </li>
  );
});

export default TaskItem;
