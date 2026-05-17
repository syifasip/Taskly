const Role = require('../models/role.model');
const { AppError } = require('../middleware/errorHandler');

class RoleService {
  static async create(data) {
    return await Role.create(data);
  }

  static async getByWorkspace(workspace_id) {
    return await Role.findByWorkspace(workspace_id);
  }

  static async update(role_id, data) {
    const existing = await Role.findById(role_id);
    if (!existing) throw new AppError('Role not found', 404);
    return await Role.update(role_id, data);
  }

  static async delete(role_id) {
    const existing = await Role.findById(role_id);
    if (!existing) throw new AppError('Role not found', 404);
    await Role.delete(role_id);
  }
}

module.exports = RoleService;