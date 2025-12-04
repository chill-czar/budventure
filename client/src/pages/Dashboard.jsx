import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../api/stats';
import TaskForm from '../components/TaskForm';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import TaskManagement from '../components/dashboard/TaskManagement';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityStats, setActivityStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger TaskList refresh
  const { user, logout } = useAuth();

  useEffect(() => {
    // Clear any stale data on component mount

    setTaskStats(null);
    setActivityStats(null);
    setStatsLoading(true);
    setShowTaskForm(false);
    setEditingTask(null);

    const fetchStats = async () => {
      try {

        setStatsLoading(true);
        const [taskStatsResponse, activityStatsResponse] = await Promise.all([
          statsAPI.getTaskStats(),
          statsAPI.getActivityStats()
        ]);


        setTaskStats(taskStatsResponse);
        setActivityStats(activityStatsResponse);

      } catch (error) {
        console.error('Dashboard: Error fetching stats:', error);
        setTaskStats(null);
        setActivityStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refreshStats = async () => {
    try {
      setStatsLoading(true);
      const [taskStatsResponse, activityStatsResponse] = await Promise.all([
        statsAPI.getTaskStats(),
        statsAPI.getActivityStats()
      ]);
      setTaskStats(taskStatsResponse);
      setActivityStats(activityStatsResponse);
    } catch (error) {
      setTaskStats(null);
      setActivityStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Function to refresh both stats and task list
  const refreshAllData = async () => {
    await refreshStats();
    // The task change callback will handle task list refresh
  };

  const handleTaskChange = () => {
    refreshAllData();
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    refreshAllData();
    // Trigger TaskList refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <StatsOverview
            taskStats={taskStats}
            statsLoading={statsLoading}
            hasErrors={!taskStats?.data?.stats}
          />

          <TaskManagement
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
            onTaskChange={handleTaskChange}
            refreshTrigger={refreshTrigger}
          />

          {/* Task Form Modal */}
          {showTaskForm && (
            <TaskForm
              task={editingTask}
              onClose={handleCloseForm}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
