import React, { useState } from 'react';
import TaskList from '../TaskList';
import TaskForm from '../TaskForm';
import { Button } from '../ui/button';

const TaskManagement = React.memo(() => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <Button onClick={handleCreateTask}>
          + New Task
        </Button>
      </div>

      {/* Task List */}
      <TaskList onEditTask={handleEditTask} />

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
});

TaskManagement.displayName = 'TaskManagement';

export default TaskManagement;
