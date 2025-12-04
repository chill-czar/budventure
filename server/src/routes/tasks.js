const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask
} = require('../controllers/taskController');

const { protect } = require('../middleware/auth');

// All task routes require authentication
router.use(protect);

// Routes
router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Task assignment route
router.put('/:id/assign', assignTask);

module.exports = router;
