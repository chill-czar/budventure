const Task = require('../models/Task');
const User = require('../models/User');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const buildQuery = (req, userId) => {
  const query = {};

  query.$or = [
    { createdBy: userId },
    { assignedTo: userId }
  ];

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo;
  }

  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  if (req.query.dueDateFrom || req.query.dueDateTo) {
    query.dueDate = {};
    if (req.query.dueDateFrom) {
      query.dueDate.$gte = new Date(req.query.dueDateFrom);
    }
    if (req.query.dueDateTo) {
      query.dueDate.$lte = new Date(req.query.dueDateTo);
    }
  }

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  return query;
};

const buildSort = (req) => {
  const sort = {};
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'dueDate':
    case 'priority':
    case 'status':
    case 'createdAt':
    case 'updatedAt':
      sort[sortBy] = sortOrder;
      break;
    default:
      sort.createdAt = -1;
  }

  return sort;
};

const getTasks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = buildQuery(req, req.user._id);
  const sort = buildSort(req);

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  const totalPages = Math.ceil(total / limit);

  sendPaginated(
    res,
    200,
    tasks,
    page,
    totalPages,
    total,
    limit,
    'Tasks retrieved successfully'
  );
};

const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    return sendError(res, 404, 'Task not found');
  }

  if (
    task.createdBy._id.toString() !== req.user._id.toString() &&
    task.assignedTo._id.toString() !== req.user._id.toString()
  ) {
    return sendError(res, 403, 'Not authorized to view this task');
  }

  sendSuccess(res, 200, 'Task retrieved successfully', { task });
};

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, tags, assignedTo } = req.body;

  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return sendError(res, 404, 'Assigned user not found');
    }
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    dueDate,
    tags,
    assignedTo: assignedTo || req.user._id,
    createdBy: req.user._id
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  sendSuccess(res, 201, 'Task created successfully', { task: populatedTask });
};

const updateTask = async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return sendError(res, 404, 'Task not found');
  }

  if (task.createdBy.toString() !== req.user._id.toString()) {
    return sendError(res, 403, 'Not authorized to update this task');
  }

  if (req.body.assignedTo) {
    const userExists = await User.findById(req.body.assignedTo);
    if (!userExists) {
      return sendError(res, 404, 'Assigned user not found');
    }
  }

  if (req.body.status === 'completed' && task.status !== 'completed') {
    req.body.completedAt = new Date();
  } else if (req.body.status !== 'completed') {
    req.body.completedAt = undefined;
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  sendSuccess(res, 200, 'Task updated successfully', { task });
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return sendError(res, 404, 'Task not found');
  }

  if (task.createdBy.toString() !== req.user._id.toString()) {
    return sendError(res, 403, 'Not authorized to delete this task');
  }

  await Task.findByIdAndDelete(req.params.id);

  sendSuccess(res, 200, 'Task deleted successfully');
};

const assignTask = async (req, res) => {
  const { assignedTo } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return sendError(res, 404, 'Task not found');
  }

  if (task.createdBy.toString() !== req.user._id.toString()) {
    return sendError(res, 403, 'Not authorized to assign this task');
  }

  const userExists = await User.findById(assignedTo);
  if (!userExists) {
    return sendError(res, 404, 'Assigned user not found');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { assignedTo },
    { new: true, runValidators: true }
  )
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  sendSuccess(res, 200, 'Task assigned successfully', { task: updatedTask });
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask
};
