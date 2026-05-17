const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { userUpdateValidation, deadlineDaysValidation, validate } = require('../utils/validators');

router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, userUpdateValidation, validate, UserController.updateProfile);
router.get('/workspaces', authenticateToken, UserController.getWorkspaces);
router.get('/tasks', authenticateToken, UserController.getAssignedTasks);
router.get('/stats', authenticateToken, UserController.getStats);
router.get('/deadlines', authenticateToken, deadlineDaysValidation, validate, UserController.getUpcomingDeadlines);

module.exports = router;