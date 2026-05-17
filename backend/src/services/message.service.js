const Message = require('../models/message.model');
const ActivityLog = require('../models/activity_log.model');
const RedisService = require('./redis.service');

class MessageService {
  static async send({ workspace_id, sender_id, content, reply_to }) {
    const message = await Message.create({ workspace_id, sender_id, content, reply_to });

    // publish ke Redis Pub/Sub untuk realtime
    await RedisService.publishMessage(workspace_id, {
      message_id: message.message_id,
      sender_id,
      content,
      reply_to: reply_to || null,
      sent_at: message.sent_at,
    });

    return message;
  }

  static async getHistory(workspace_id, limit) {
    return await Message.findByWorkspace(workspace_id, limit);
  }

  static async delete(message_id) {
    await Message.delete(message_id);
  }

  static async getActivity(workspace_id) {
    return await ActivityLog.findByWorkspace(workspace_id);
  }
}

module.exports = MessageService;