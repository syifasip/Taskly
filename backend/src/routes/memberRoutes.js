const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/member.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/rbacMiddleware');
const { workspaceIdValidation, validate } = require('../utils/validators');

router.post('/:workspace_id', authenticateToken, workspaceIdValidation, validate, checkPermission('manage_roles'), MemberController.add);
router.get('/:workspace_id', authenticateToken, workspaceIdValidation, validate, MemberController.getByWorkspace);
router.put('/:workspace_id/:user_id', authenticateToken, workspaceIdValidation, validate, checkPermission('manage_roles'), MemberController.updateRole);
router.delete('/:workspace_id/:user_id', authenticateToken, workspaceIdValidation, validate, checkPermission('manage_roles'), MemberController.remove);

module.exports = router;