const MessageService = require('../services/message.service');

class MessageController {
  static async send(req, res, next) {
    try {
      const { user_id } = req.user;
      const { workspace_id } = req.params;
      const { content, reply_to } = req.body;
      const message = await MessageService.send({ workspace_id, sender_id: user_id, content, reply_to });
      res.status(201).json({
        success: true,
        message: 'Message sent',
        payload: message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const { limit } = req.query;
      const messages = await MessageService.getHistory(workspace_id, limit || 50);
      res.status(200).json({
        success: true,
        message: 'Messages fetched',
        payload: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { message_id } = req.params;
      await MessageService.delete(message_id);
      res.status(200).json({
        success: true,
        message: 'Message deleted',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActivity(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const activity = await MessageService.getActivity(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Activity fetched',
        payload: activity,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MessageController;