import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskFormFields from './task-form/TaskFormFields';
import TaskFormActions from './task-form/TaskFormActions';

const TaskForm = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });

  const [error, setError] = useState(null);
  const { createTask, updateTask, isCreating, isUpdating } = useTasks();

  const isEditing = !!task;
  const isSubmitting = isEditing ? isUpdating(task?._id) : isCreating;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setError(null);

    // Prepare data
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    try {
      if (isEditing) {
        await updateTask({ taskId: task._id, updates: taskData });
      } else {
        await createTask(taskData);
      }

      // ✅ Task appears instantly in UI, then syncs
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      // ✅ On failure, optimistic update automatically rolls back
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskFormFields formData={formData} handleChange={handleChange} />
          <TaskFormActions onClose={onClose} loading={isSubmitting} isEditing={isEditing} />
        </form>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskForm;
