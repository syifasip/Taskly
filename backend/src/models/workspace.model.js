const db = require('../config/database');

class Workspace {
  static async create({ name, custom_url, color, access_type, owner_id }) {
    const result = await db.query(
      `INSERT INTO workspaces (name, custom_url, color, access_type, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, custom_url, color || 'blue', access_type || 'invite', owner_id]
    );
    return result.rows[0];
  }

  static async findByUrl(custom_url) {
    const result = await db.query(
      'SELECT * FROM workspaces WHERE custom_url = $1',
      [custom_url]
    );
    return result.rows[0];
  }

  static async findById(workspace_id) {
    const result = await db.query(
      'SELECT * FROM workspaces WHERE workspace_id = $1',
      [workspace_id]
    );
    return result.rows[0];
  }

  static async update(workspace_id, { name, color, access_type }) {
    const result = await db.query(
      `UPDATE workspaces SET
        name = COALESCE($1, name),
        color = COALESCE($2, color),
        access_type = COALESCE($3, access_type)
       WHERE workspace_id = $4
       RETURNING *`,
      [name, color, access_type, workspace_id]
    );
    return result.rows[0];
  }

  static async delete(workspace_id) {
    await db.query(
      'DELETE FROM workspaces WHERE workspace_id = $1',
      [workspace_id]
    );
  }

  static async getMembers(workspace_id) {
    const result = await db.query(
      `SELECT u.user_id, u.full_name, u.email,
              r.role_name, r.role_id, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.user_id
       JOIN roles r ON wm.role_id = r.role_id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC`,
      [workspace_id]
    );
    return result.rows;
  }

  static async isMember(workspace_id, user_id) {
    const result = await db.query(
      `SELECT 1 FROM workspace_members
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspace_id, user_id]
    );
    return result.rows.length > 0;
  }
}

module.exports = Workspace;