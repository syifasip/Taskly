const db = require('../config/database');

class ActivityLog {
  static async create({ workspace_id, user_id, action, target_title }) {
    const result = await db.query(
      `INSERT INTO activity_log (workspace_id, user_id, action, target_title)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspace_id, user_id, action, target_title || null]
    );
    return result.rows[0];
  }

  static async findByWorkspace(workspace_id, limit = 20) {
    const result = await db.query(
      `SELECT al.*, u.full_name AS user_name
       FROM activity_log al
       LEFT JOIN users u ON al.user_id = u.user_id
       WHERE al.workspace_id = $1
       ORDER BY al.created_at DESC
       LIMIT $2`,
      [workspace_id, limit]
    );
    return result.rows;
  }
}

module.exports = ActivityLog;