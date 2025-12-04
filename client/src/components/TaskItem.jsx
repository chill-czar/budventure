import React from 'react';

const TaskItem = React.memo(({ task, onEdit, onDelete, onStatusChange, updatingId, deletingId }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <li className="p-6 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            {task.tags.length > 0 && (
              <span className="ml-4">Tags: {task.tags.join(', ')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            disabled={updatingId === task._id}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            disabled={deletingId === task._id}
            className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
          >
            {deletingId === task._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </li>
  );
});

export default TaskItem;
