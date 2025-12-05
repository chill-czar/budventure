const Task = require('../models/Task');
const { sendSuccess } = require('../utils/response');

const getTaskStats = async (req, res) => {
  const userId = req.user._id;

  try {
    // Comprehensive aggregation pipeline for task statistics
    const [stats] = await Task.aggregate([
      // Match user's tasks (assigned to or created by)
      {
        $match: {
          $or: [
            { assignedTo: userId },
            { createdBy: userId }
          ]
        }
      },

      // Group all stats in one pipeline stage
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
          },
          // Date calculations for alerts
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "completed"] },
                    { $lt: ["$dueDate", new Date()] }
                  ]
                },
                1, 0
              ]
            }
          },
          dueToday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "completed"] },
                    { $gte: ["$dueDate", new Date(new Date().setHours(0, 0, 0, 0))] },
                    { $lt: ["$dueDate", new Date(new Date().setHours(23, 59, 59, 999))] }
                  ]
                },
                1, 0
              ]
            }
          },
          dueThisWeek: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$status", "completed"] },
                    { $gte: ["$dueDate", new Date()] },
                    { $lte: ["$dueDate", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] }
                  ]
                },
                1, 0
              ]
            }
          },
          // Analytics data
          createdTasks: {
            $push: {
              $cond: [
                { $eq: ["$createdBy", userId] },
                "$status",
                "$$REMOVE"
              ]
            }
          },
          priorities: { $push: "$priority" }
        }
      },

      // Process final computations
      {
        $project: {
          total: 1,
          pending: 1,
          inProgress: 1,
          completed: 1,
          cancelled: 1,
          overdue: 1,
          dueToday: 1,
          dueThisWeek: 1,
          createdTasks: {
            $filter: {
              input: "$createdTasks",
              cond: { $ne: ["$$this", null] }
            }
          },
          priorities: 1
        }
      },

      // Add computed fields
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: [{ $size: "$createdTasks" }, 0] },
              {
                $round: [{
                  $multiply: [
                    {
                      $divide: [
                        {
                          $size: {
                            $filter: {
                              input: "$createdTasks",
                              cond: { $eq: ["$$this", "completed"] }
                            }
                          }
                        },
                        { $size: "$createdTasks" }
                      ]
                    },
                    100
                  ]
                }, 0]
              },
              0
            ]
          },
          priorityDistribution: {
            low: {
              $size: {
                $filter: {
                  input: "$priorities",
                  cond: { $eq: ["$$this", "low"] }
                }
              }
            },
            medium: {
              $size: {
                $filter: {
                  input: "$priorities",
                  cond: { $eq: ["$$this", "medium"] }
                }
              }
            },
            high: {
              $size: {
                $filter: {
                  input: "$priorities",
                  cond: { $eq: ["$$this", "high"] }
                }
              }
            },
            urgent: {
              $size: {
                $filter: {
                  input: "$priorities",
                  cond: { $eq: ["$$this", "urgent"] }
                }
              }
            }
          }
        }
      },

      // Final projection to match expected format
      {
        $project: {
          _id: 0,
          basic: {
            total: "$total",
            pending: "$pending",
            inProgress: "$inProgress",
            completed: "$completed",
            cancelled: "$cancelled"
          },
          alerts: {
            overdue: "$overdue",
            dueToday: "$dueToday",
            dueThisWeek: "$dueThisWeek"
          },
          analytics: {
            completionRate: "$completionRate",
            priorityDistribution: "$priorityDistribution"
          }
        }
      }
    ]);

    // Handle case where user has no tasks
    const taskStats = stats || {
      basic: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0
      },
      alerts: {
        overdue: 0,
        dueToday: 0,
        dueThisWeek: 0
      },
      analytics: {
        completionRate: 0,
        priorityDistribution: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0
        }
      }
    };

    sendSuccess(res, 200, 'Task statistics retrieved successfully', { stats: taskStats });
  } catch (error) {
    console.error('Stats aggregation error:', error);
    sendError(res, 500, 'Error retrieving task statistics');
  }
};

const getActivityStats = async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Use aggregation for activity stats as well for better performance
    const activityData = await Task.aggregate([
      {
        $match: {
          $or: [
            { createdBy: userId },
            { assignedTo: userId }
          ]
        }
      },
      {
        $facet: {
          recentTasks: [
            {
              $sort: { updatedAt: -1 }
            },
            {
              $limit: limit
            },
            {
              $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedUser',
                pipeline: [{ $project: { name: 1 } }]
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdUser',
                pipeline: [{ $project: { name: 1 } }]
              }
            },
            {
              $project: {
                title: 1,
                status: 1,
                updatedAt: 1,
                createdAt: 1,
                assignedTo: { $arrayElemAt: ["$assignedUser.name", 0] },
                createdBy: { $arrayElemAt: ["$createdUser.name", 0] }
              }
            }
          ],
          weeklyStats: [
            {
              $match: {
                status: 'completed',
                updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
              }
            },
            {
              $count: "completedThisWeek"
            }
          ]
        }
      }
    ]);

    const [result] = activityData;
    const recentTasks = result.recentTasks || [];
    const completedLastWeek = result.weeklyStats[0]?.completedThisWeek || 0;

    const activityStats = {
      recentTasks,
      completedLastWeek,
      trending: completedLastWeek > 2 ? 'active' :
               completedLastWeek > 0 ? 'moderate' : 'inactive'
    };

    sendSuccess(res, 200, 'Activity statistics retrieved successfully', { activity: activityStats });
  } catch (error) {
    console.error('Activity stats aggregation error:', error);
    sendError(res, 500, 'Error retrieving activity statistics');
  }
};

module.exports = {
  getTaskStats,
  getActivityStats
};
