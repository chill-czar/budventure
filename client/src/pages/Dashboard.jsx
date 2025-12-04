import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../api/stats';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

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
    console.log('Dashboard: Component mounted, clearing stale data');
    setTaskStats(null);
    setActivityStats(null);
    setStatsLoading(true);
    setShowTaskForm(false);
    setEditingTask(null);

    const fetchStats = async () => {
      try {
        console.log('Dashboard: Fetching fresh stats...');
        setStatsLoading(true);
        const [taskStatsResponse, activityStatsResponse] = await Promise.all([
          statsAPI.getTaskStats(),
          statsAPI.getActivityStats()
        ]);
        console.log('Dashboard: Task stats response:', taskStatsResponse);
        console.log('Dashboard: Activity stats response:', activityStatsResponse);
        setTaskStats(taskStatsResponse);
        setActivityStats(activityStatsResponse);
        console.log('Dashboard: Fresh stats loaded');
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
    console.log('Dashboard: Refreshing stats...');
    try {
      setStatsLoading(true);
      const [taskStatsResponse, activityStatsResponse] = await Promise.all([
        statsAPI.getTaskStats(),
        statsAPI.getActivityStats()
      ]);
      console.log('Dashboard: Stats refreshed:', taskStatsResponse);
      setTaskStats(taskStatsResponse);
      setActivityStats(activityStatsResponse);
    } catch (error) {
      console.error('Dashboard: Error refreshing stats:', error);
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
    console.log('Dashboard: Refreshing all data...');
    await refreshStats();
    // The task change callback will handle task list refresh
  };

  const handleTaskChange = () => {
    console.log('Dashboard: Task changed, refreshing data...');
    refreshAllData();
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    console.log('Dashboard: Form closed, refreshing all data');
    refreshAllData();
    // Trigger TaskList refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Section */}
          {statsLoading ? (
            <div className="mb-8 flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading statistics...</p>
              </div>
            </div>
          ) : taskStats?.data?.stats ? (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">{taskStats.data.stats.basic?.total || 0}</div>
                  <div className="text-sm text-gray-500">Total Tasks</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-yellow-600">{taskStats.data.stats.basic?.pending || 0}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-purple-600">{taskStats.data.stats.basic?.inProgress || 0}</div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-green-600">{taskStats.data.stats.basic?.completed || 0}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Alerts</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overdue Tasks:</span>
                      <span className="font-medium text-red-600">{taskStats.data.stats.alerts?.overdue || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Due Today:</span>
                      <span className="font-medium text-orange-600">{taskStats.data.stats.alerts?.dueToday || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Due This Week:</span>
                      <span className="font-medium text-blue-600">{taskStats.data.stats.alerts?.dueThisWeek || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Analytics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completion Rate:</span>
                      <span className="font-medium text-green-600">{taskStats.data.stats.analytics?.completionRate || 0}%</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600 mb-1">Priority Distribution:</div>
                      {taskStats.data.stats.analytics?.priorityDistribution ?
                        Object.entries(taskStats.data.stats.analytics.priorityDistribution).map(([priority, count]) => (
                          <div key={priority} className="flex justify-between text-sm">
                            <span className="capitalize">{priority}:</span>
                            <span className="font-medium">{count || 0}</span>
                          </div>
                        )) :
                        <div className="text-sm text-gray-500">No data available</div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : !statsLoading ? (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">Unable to load task statistics. You can still use the task management features below.</p>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
            <button
              onClick={handleCreateTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + New Task
            </button>
          </div>

          {/* Task List */}
          <TaskList onEditTask={handleEditTask} onTaskChange={handleTaskChange} refreshTrigger={refreshTrigger} />

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
