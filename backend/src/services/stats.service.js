const db = require('../config/database');

class StatsService {
  static async getTasksByStatus(workspace_id) {
    const result = await db.query(
      `SELECT status, COUNT(*) AS count
       FROM tasks
       WHERE workspace_id = $1
       GROUP BY status`,
      [workspace_id]
    );
    return result.rows;
  }

  static async getTasksByWorkspace(user_id) {
    const result = await db.query(
      `SELECT w.workspace_id, w.name, w.color,
              COUNT(t.task_id) AS total_tasks,
              COUNT(t.task_id) FILTER (WHERE t.status = 'completed') AS completed
       FROM workspaces w
       JOIN workspace_members wm ON wm.workspace_id = w.workspace_id
       LEFT JOIN tasks t ON t.workspace_id = w.workspace_id
       WHERE wm.user_id = $1
       GROUP BY w.workspace_id, w.name, w.color
       ORDER BY total_tasks DESC`,
      [user_id]
    );
    return result.rows;
  }

  static async getOnTimeRate(user_id) {
    const result = await db.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') AS total_completed,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'completed' AND completed_at <= due_date)
          * 100.0 / NULLIF(COUNT(*) FILTER (WHERE status = 'completed'), 0), 1
        ) AS on_time_rate
       FROM tasks
       WHERE creator_id = $1 OR assignee_id = $1`,
      [user_id]
    );
    return result.rows[0];
  }

  static async getMonthlyCompleted(user_id) {
    const result = await db.query(
      `SELECT COUNT(*) AS total
       FROM tasks
       WHERE (creator_id = $1 OR assignee_id = $1)
         AND status = 'completed'
         AND completed_at >= DATE_TRUNC('month', NOW())`,
      [user_id]
    );
    return result.rows[0];
  }
}

module.exports = StatsService;