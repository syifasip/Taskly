const db = require('../config/database');

class Member {
  static async add({ workspace_id, user_id, role_id }) {
    const result = await db.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [workspace_id, user_id, role_id]
    );
    return result.rows[0];
  }

  static async findByWorkspace(workspace_id) {
    const result = await db.query(
      `SELECT u.user_id, u.full_name, u.email,
              r.role_id, r.role_name, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.user_id
       JOIN roles r ON wm.role_id = r.role_id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC`,
      [workspace_id]
    );
    return result.rows;
  }

  static async updateRole({ workspace_id, user_id, role_id }) {
    const result = await db.query(
      `UPDATE workspace_members SET role_id = $1
       WHERE workspace_id = $2 AND user_id = $3
       RETURNING *`,
      [role_id, workspace_id, user_id]
    );
    return result.rows[0];
  }

  static async remove({ workspace_id, user_id }) {
    await db.query(
      `DELETE FROM workspace_members
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspace_id, user_id]
    );
  }

  static async isMember(workspace_id, user_id) {
    const result = await db.query(
      `SELECT 1 FROM workspace_members
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspace_id, user_id]
    );
    return result.rows.length > 0;
  }

  static async getRole(workspace_id, user_id) {
    const result = await db.query(
      `SELECT r.* FROM workspace_members wm
       JOIN roles r ON wm.role_id = r.role_id
       WHERE wm.workspace_id = $1 AND wm.user_id = $2`,
      [workspace_id, user_id]
    );
    return result.rows[0];
  }
}

module.exports = Member;