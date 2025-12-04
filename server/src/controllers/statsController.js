const Task = require('../models/Task');
const { sendSuccess } = require('../utils/response');

const getTaskStats = async (req, res) => {
  const userId = req.user._id;

  const tasks = await Task.find({
    $or: [{ assignedTo: userId }, { createdBy: userId }]
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const overdueTasks = tasks.filter(t => t.status !== 'completed' && t.dueDate < now).length;
  const dueToday = tasks.filter(t =>
    t.status !== 'completed' &&
    t.dueDate >= today &&
    t.dueDate < tomorrow
  ).length;

  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const dueThisWeek = tasks.filter(t =>
    t.status !== 'completed' &&
    t.dueDate >= now &&
    t.dueDate <= weekFromNow
  ).length;

  const createdTasks = tasks.filter(t => t.createdBy.toString() === userId.toString());
  const completionRate = createdTasks.length > 0
    ? Math.round((createdTasks.filter(t => t.status === 'completed').length / createdTasks.length) * 100)
    : 0;

  const priorityCounts = {};
  tasks.forEach(t => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });

  const taskStats = {
    basic: stats,
    alerts: {
      overdue: overdueTasks,
      dueToday: dueToday,
      dueThisWeek: dueThisWeek
    },
    analytics: {
      completionRate: completionRate,
      priorityDistribution: priorityCounts
    }
  };

  sendSuccess(res, 200, 'Task statistics retrieved successfully', { stats: taskStats });
};

const getActivityStats = async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 10;

  const recentTasks = await Task.find({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ]
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .populate('assignedTo', 'name')
    .populate('createdBy', 'name')
    .select('title status updatedAt createdAt');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const completedLastWeek = await Task.countDocuments({
    $or: [
      { createdBy: userId },
      { assignedTo: userId }
    ],
    status: 'completed',
    updatedAt: { $gte: sevenDaysAgo }
  });

  const activityStats = {
    recentTasks,
    completedLastWeek,
    trending: completedLastWeek > 0 ? 'active' : 'inactive'
  };

  sendSuccess(res, 200, 'Activity statistics retrieved successfully', { activity: activityStats });
};

module.exports = {
  getTaskStats,
  getActivityStats
};
