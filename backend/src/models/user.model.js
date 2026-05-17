const db = require('../config/database');

class User {
  static async create({ full_name, email, password }) {
    const result = await db.query(
      `INSERT INTO users (full_name, email, password)
       VALUES ($1, $2, $3)
       RETURNING user_id, full_name, email, created_at`,
      [full_name, email, password]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT user_id, full_name, email, created_at FROM users WHERE user_id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, { full_name, email, password }) {
    const result = await db.query(
      `UPDATE users SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        password = COALESCE($3, password)
       WHERE user_id = $4
       RETURNING user_id, full_name, email`,
      [full_name, email, password, id]
    );
    return result.rows[0];
  }

  static async getWorkspaces(userId) {
    const result = await db.query(
      `SELECT w.workspace_id, w.name, w.custom_url, w.color, w.access_type,
              r.role_name, wm.joined_at
       FROM workspace_members wm
       JOIN workspaces w ON wm.workspace_id = w.workspace_id
       JOIN roles r ON wm.role_id = r.role_id
       WHERE wm.user_id = $1
       ORDER BY wm.joined_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getAssignedTasks(userId) {
    const result = await db.query(
      `SELECT t.task_id, t.title, t.priority, t.status,
              t.due_date, t.color, t.is_pinned,
              w.name AS workspace_name, w.custom_url
       FROM tasks t
       JOIN workspaces w ON t.workspace_id = w.workspace_id
       WHERE t.assignee_id = $1
       ORDER BY t.due_date ASC NULLS LAST`,
      [userId]
    );
    return result.rows;
  }

  static async getStats(userId) {
    const result = await db.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') AS total_completed,
        COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS total_in_progress,
        COUNT(*) FILTER (WHERE status = 'completed' AND due_date IS NOT NULL
          AND completed_at > due_date) AS total_late,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'completed' AND completed_at <= due_date)
          * 100.0 / NULLIF(COUNT(*) FILTER (WHERE status = 'completed'), 0), 1
        ) AS on_time_rate
       FROM tasks
       WHERE creator_id = $1 OR assignee_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async getTasksPerWorkspace(userId) {
    const result = await db.query(
      `SELECT w.name AS workspace_name, w.color,
              COUNT(t.task_id) AS total_tasks,
              COUNT(t.task_id) FILTER (WHERE t.status = 'completed') AS completed
       FROM workspaces w
       JOIN workspace_members wm ON wm.workspace_id = w.workspace_id
       LEFT JOIN tasks t ON t.workspace_id = w.workspace_id
         AND (t.creator_id = $1 OR t.assignee_id = $1)
       WHERE wm.user_id = $1
       GROUP BY w.workspace_id, w.name, w.color
       ORDER BY total_tasks DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getUpcomingDeadlines(userId, days = 7) {
    const result = await db.query(
      `SELECT t.task_id, t.title, t.due_date, t.priority,
              t.status, w.name AS workspace_name
       FROM tasks t
       JOIN workspaces w ON t.workspace_id = w.workspace_id
       WHERE (t.creator_id = $1 OR t.assignee_id = $1)
         AND t.status != 'completed'
         AND t.due_date BETWEEN NOW() AND NOW() + ($2 || ' days')::INTERVAL
       ORDER BY t.due_date ASC`,
      [userId, days]
    );
    return result.rows;
  }
}

module.exports = User;