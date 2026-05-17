const db = require('../config/database');

class Task {
  static async create({ workspace_id, creator_id, assignee_id, title, description, due_date, priority, is_pinned, color }) {
    const result = await db.query(
      `INSERT INTO tasks
        (workspace_id, creator_id, assignee_id, title, description, due_date, priority, is_pinned, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [workspace_id, creator_id, assignee_id || null, title, description || null,
       due_date || null, priority || 'medium', is_pinned || false, color || 'yellow']
    );
    return result.rows[0];
  }

  static async findById(task_id) {
    const result = await db.query(
      `SELECT t.*, 
              u1.full_name AS creator_name,
              u2.full_name AS assignee_name
       FROM tasks t
       LEFT JOIN users u1 ON t.creator_id = u1.user_id
       LEFT JOIN users u2 ON t.assignee_id = u2.user_id
       WHERE t.task_id = $1`,
      [task_id]
    );
    return result.rows[0];
  }

  static async findByWorkspace(workspace_id) {
    const result = await db.query(
      `SELECT t.*,
              u1.full_name AS creator_name,
              u2.full_name AS assignee_name
       FROM tasks t
       LEFT JOIN users u1 ON t.creator_id = u1.user_id
       LEFT JOIN users u2 ON t.assignee_id = u2.user_id
       WHERE t.workspace_id = $1
       ORDER BY t.is_pinned DESC, t.created_at DESC`,
      [workspace_id]
    );
    return result.rows;
  }

  static async update(task_id, { title, description, due_date, priority, is_pinned, color, status, assignee_id }) {
    const result = await db.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_date = COALESCE($3, due_date),
        priority = COALESCE($4, priority),
        is_pinned = COALESCE($5, is_pinned),
        color = COALESCE($6, color),
        status = COALESCE($7, status),
        assignee_id = COALESCE($8, assignee_id)
       WHERE task_id = $9
       RETURNING *`,
      [title, description, due_date, priority, is_pinned, color, status, assignee_id, task_id]
    );
    return result.rows[0];
  }

  static async delete(task_id) {
    await db.query('DELETE FROM tasks WHERE task_id = $1', [task_id]);
  }

  static async getPinned(workspace_id) {
    const result = await db.query(
      `SELECT t.*,
              u.full_name AS assignee_name
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.user_id
       WHERE t.workspace_id = $1 AND t.is_pinned = TRUE
       ORDER BY t.created_at DESC`,
      [workspace_id]
    );
    return result.rows;
  }

  static async getByStatus(workspace_id, status) {
    const result = await db.query(
      `SELECT * FROM tasks
       WHERE workspace_id = $1 AND status = $2
       ORDER BY due_date ASC NULLS LAST`,
      [workspace_id, status]
    );
    return result.rows;
  }

  static async getUpcoming(workspace_id, days = 7) {
    const result = await db.query(
      `SELECT * FROM tasks
       WHERE workspace_id = $1
         AND status != 'completed'
         AND due_date BETWEEN NOW() AND NOW() + ($2 || ' days')::INTERVAL
       ORDER BY due_date ASC`,
      [workspace_id, days]
    );
    return result.rows;
  }
}

module.exports = Task;