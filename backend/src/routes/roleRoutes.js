const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const {
  roleCreationValidation,
  roleUpdateValidation,
  roleIdValidation,
  workspaceIdValidation,
  validate
} = require('../utils/validators');

router.post('/:workspace_id', authenticateToken, workspaceIdValidation, roleCreationValidation, validate, checkPermission('manage_roles'), RoleController.create);
router.get('/:workspace_id', authenticateToken, workspaceIdValidation, validate, checkPermission('view_tasks'), RoleController.getByWorkspace);
router.put('/:workspace_id/:role_id', authenticateToken, roleIdValidation, roleUpdateValidation, validate, checkPermission('manage_roles'), RoleController.update);
router.delete('/:workspace_id/:role_id', authenticateToken, roleIdValidation, validate, checkPermission('manage_roles'), RoleController.delete);

module.exports = router;