import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../api/stats';
import { useBackgroundRefresh } from '../hooks/useBackgroundRefresh';
import TaskForm from '../components/TaskForm';
import ErrorBoundary from '../components/ErrorBoundary';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import TaskManagement from '../components/dashboard/TaskManagement';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger TaskList refresh
  const { user, logout } = useAuth();

  useEffect(() => {
    // Clear any stale data on component mount

    setTaskStats(null);
    setStatsLoading(true);
    setShowTaskForm(false);
    setEditingTask(null);

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const taskStatsResponse = await statsAPI.getTaskStats();

        setTaskStats(taskStatsResponse);

      } catch (error) {
        console.error('Dashboard: Error fetching stats:', error);
        setTaskStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refreshStatsOnly = async () => {
    try {
      setStatsLoading(true);
      const taskStatsResponse = await statsAPI.getTaskStats();
      setTaskStats(taskStatsResponse);
    } catch (error) {
      console.error('Dashboard: Error fetching stats:', error);
      setTaskStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // Background refresh for stats every 60 seconds
  useBackgroundRefresh(refreshStatsOnly, 60000);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskChange = () => {
    refreshStatsOnly(); // Only refresh stats, not tasks
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    refreshStatsOnly(); // Only refresh stats after form close
    setRefreshTrigger(prev => prev + 1); // Still trigger TaskList refresh for consistency
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ErrorBoundary>
            <StatsOverview
              taskStats={taskStats}
              statsLoading={statsLoading}
              hasErrors={!taskStats?.data?.stats}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <TaskManagement
              onCreateTask={handleCreateTask}
              onEditTask={handleEditTask}
              onTaskChange={handleTaskChange}
              refreshTrigger={refreshTrigger}
            />
          </ErrorBoundary>

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
