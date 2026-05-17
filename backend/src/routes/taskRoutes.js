const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const {
  taskCreationValidation,
  taskUpdateValidation,
  taskIdValidation,
  workspaceIdValidation,
  validate
} = require('../utils/validators');

router.post('/:workspace_id', authenticateToken, workspaceIdValidation, taskCreationValidation, validate, checkPermission('create_tasks'), TaskController.create);
router.get('/:workspace_id', authenticateToken, workspaceIdValidation, validate, checkPermission('view_tasks'), TaskController.getByWorkspace);
router.get('/:workspace_id/pinned', authenticateToken, workspaceIdValidation, validate, checkPermission('view_tasks'), TaskController.getPinned);
router.get('/:workspace_id/stats', authenticateToken, workspaceIdValidation, validate, TaskController.getStats);
router.get('/:workspace_id/:task_id', authenticateToken, taskIdValidation, validate, checkPermission('view_tasks'), TaskController.getById);
router.put('/:workspace_id/:task_id', authenticateToken, taskIdValidation, taskUpdateValidation, validate, checkPermission('update_tasks'), TaskController.update);
router.delete('/:workspace_id/:task_id', authenticateToken, taskIdValidation, validate, checkPermission('delete_tasks'), TaskController.delete);

module.exports = router;