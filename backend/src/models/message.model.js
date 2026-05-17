const db = require('../config/database');

class Message {
  static async create({ workspace_id, sender_id, content, reply_to }) {
    const result = await db.query(
      `INSERT INTO messages (workspace_id, sender_id, content, reply_to)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspace_id, sender_id, content, reply_to || null]
    );
    return result.rows[0];
  }

  static async findByWorkspace(workspace_id, limit = 50) {
    const result = await db.query(
      `SELECT m.*,
              u.full_name AS sender_name,
              r.content AS reply_content,
              ru.full_name AS reply_sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.user_id
       LEFT JOIN messages r ON m.reply_to = r.message_id
       LEFT JOIN users ru ON r.sender_id = ru.user_id
       WHERE m.workspace_id = $1
       ORDER BY m.sent_at ASC
       LIMIT $2`,
      [workspace_id, limit]
    );
    return result.rows;
  }

  static async findById(message_id) {
    const result = await db.query(
      `SELECT m.*, u.full_name AS sender_name
       FROM messages m
       JOIN users u ON m.sender_id = u.user_id
       WHERE m.message_id = $1`,
      [message_id]
    );
    return result.rows[0];
  }

  static async delete(message_id) {
    await db.query('DELETE FROM messages WHERE message_id = $1', [message_id]);
  }
}

module.exports = Message;