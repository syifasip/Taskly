const Workspace = require('../models/workspace.model');
const Member = require('../models/member.model');
const Role = require('../models/role.model');
const { AppError } = require('../middleware/errorHandler');

class WorkspaceService {
  static async create({ name, custom_url, color, access_type, owner_id }) {
    const existing = await Workspace.findByUrl(custom_url);
    if (existing) throw new AppError('Custom URL already taken', 400);

    const workspace = await Workspace.create({ name, custom_url, color, access_type, owner_id });

    // auto-create default Admin role
    const adminRole = await Role.create({
      workspace_id: workspace.workspace_id,
      role_name: 'Admin',
      view_tasks: true,
      create_tasks: true,
      update_tasks: true,
      delete_tasks: true,
      manage_roles: true,
    });

    // auto-add owner sebagai Admin
    await Member.add({
      workspace_id: workspace.workspace_id,
      user_id: owner_id,
      role_id: adminRole.role_id,
    });

    return workspace;
  }

  static async getByUrl(custom_url) {
    return await Workspace.findByUrl(custom_url);
  }

  static async getById(workspace_id) {
    return await Workspace.findById(workspace_id);
  }

  static async update(workspace_id, data) {
    return await Workspace.update(workspace_id, data);
  }

  static async delete(workspace_id) {
    return await Workspace.delete(workspace_id);
  }

  static async getMembers(workspace_id) {
    return await Workspace.getMembers(workspace_id);
  }
}

module.exports = WorkspaceService;