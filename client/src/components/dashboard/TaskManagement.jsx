import TaskList from '../TaskList';

const TaskManagement = ({
  onCreateTask,
  onEditTask,
  onTaskChange,
  refreshTrigger
}) => {
  return (
    <>
      {/* Action Buttons */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <button
          onClick={onCreateTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New Task
        </button>
      </div>

      {/* Task List */}
      <TaskList
        onEditTask={onEditTask}
        onTaskChange={onTaskChange}
        refreshTrigger={refreshTrigger}
      />
    </>
  );
};

export default TaskManagement;
