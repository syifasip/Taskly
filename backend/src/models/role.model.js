const db = require('../config/database');

class Role {
  static async create({ workspace_id, role_name, view_tasks, create_tasks, update_tasks, delete_tasks, manage_roles }) {
    const result = await db.query(
      `INSERT INTO roles
        (workspace_id, role_name, view_tasks, create_tasks, update_tasks, delete_tasks, manage_roles)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [workspace_id, role_name,
       view_tasks ?? true, create_tasks ?? false,
       update_tasks ?? false, delete_tasks ?? false,
       manage_roles ?? false]
    );
    return result.rows[0];
  }

  static async findById(role_id) {
    const result = await db.query(
      'SELECT * FROM roles WHERE role_id = $1',
      [role_id]
    );
    return result.rows[0];
  }

  static async findByWorkspace(workspace_id) {
    const result = await db.query(
      `SELECT r.*,
              COUNT(wm.user_id) AS member_count
       FROM roles r
       LEFT JOIN workspace_members wm ON wm.role_id = r.role_id
       WHERE r.workspace_id = $1
       GROUP BY r.role_id
       ORDER BY r.created_at ASC`,
      [workspace_id]
    );
    return result.rows;
  }

  static async update(role_id, { role_name, view_tasks, create_tasks, update_tasks, delete_tasks, manage_roles }) {
    const result = await db.query(
      `UPDATE roles SET
        role_name = COALESCE($1, role_name),
        view_tasks = COALESCE($2, view_tasks),
        create_tasks = COALESCE($3, create_tasks),
        update_tasks = COALESCE($4, update_tasks),
        delete_tasks = COALESCE($5, delete_tasks),
        manage_roles = COALESCE($6, manage_roles)
       WHERE role_id = $7
       RETURNING *`,
      [role_name, view_tasks, create_tasks, update_tasks, delete_tasks, manage_roles, role_id]
    );
    return result.rows[0];
  }

  static async delete(role_id) {
    await db.query('DELETE FROM roles WHERE role_id = $1', [role_id]);
  }
}

module.exports = Role;