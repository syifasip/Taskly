const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  messageCreationValidation,
  messageIdValidation,
  workspaceIdValidation,
  validate
} = require('../utils/validators');

router.post('/:workspace_id', authenticateToken, workspaceIdValidation, messageCreationValidation, validate, MessageController.send);
router.get('/:workspace_id', authenticateToken, workspaceIdValidation, validate, MessageController.getHistory);
router.get('/:workspace_id/activity', authenticateToken, workspaceIdValidation, validate, MessageController.getActivity);
router.delete('/:workspace_id/:message_id', authenticateToken, messageIdValidation, validate, MessageController.delete);

module.exports = router;