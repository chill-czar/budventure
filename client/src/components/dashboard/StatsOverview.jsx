const StatsOverview = ({ taskStats, statsLoading, hasErrors }) => {
  if (statsLoading) {
    return (
      <div className="mb-8 flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (hasErrors || !taskStats?.data?.stats) {
    return (
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">Unable to load task statistics. You can still use the task management features below.</p>
      </div>
    );
  }

  return (
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
  );
};

export default StatsOverview;
