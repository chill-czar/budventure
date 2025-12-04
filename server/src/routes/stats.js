const express = require('express');
const router = express.Router();
const {
  getTaskStats,
  getActivityStats
} = require('../controllers/statsController');

const { protect } = require('../middleware/auth');

// All stats routes require authentication
router.use(protect);

// Routes
router.get('/tasks', getTaskStats);
router.get('/activity', getActivityStats);

module.exports = router;
