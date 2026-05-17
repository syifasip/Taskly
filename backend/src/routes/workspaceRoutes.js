const express = require('express');
const router = express.Router();
const WorkspaceController = require('../controllers/workspace.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const {
  workspaceCreationValidation,
  workspaceUpdateValidation,
  workspaceIdValidation,
  validate
} = require('../utils/validators');

router.post('/', authenticateToken, workspaceCreationValidation, validate, WorkspaceController.create);
router.get('/url/:custom_url', authenticateToken, WorkspaceController.getByUrl);
router.get('/join/:invite_token', authenticateToken, WorkspaceController.joinByInvite);
router.get('/:workspace_id', authenticateToken, workspaceIdValidation, validate, WorkspaceController.getById);
router.put('/:workspace_id', authenticateToken, workspaceIdValidation, workspaceUpdateValidation, validate, WorkspaceController.update);
router.delete('/:workspace_id', authenticateToken, workspaceIdValidation, validate, WorkspaceController.delete);
router.get('/:workspace_id/members', authenticateToken, workspaceIdValidation, validate, WorkspaceController.getMembers);
router.post('/:workspace_id/invite', authenticateToken, workspaceIdValidation, validate, WorkspaceController.generateInvite);

module.exports = router;