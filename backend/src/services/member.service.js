const Member = require('../models/member.model');
const { AppError } = require('../middleware/errorHandler');

class MemberService {
  static async add({ workspace_id, user_id, role_id }) {
    const existing = await Member.isMember(workspace_id, user_id);
    if (existing) throw new AppError('User is already a member', 400);
    return await Member.add({ workspace_id, user_id, role_id });
  }

  static async getByWorkspace(workspace_id) {
    return await Member.findByWorkspace(workspace_id);
  }

  static async updateRole({ workspace_id, user_id, role_id }) {
    const existing = await Member.isMember(workspace_id, user_id);
    if (!existing) throw new AppError('User is not a member', 404);
    return await Member.updateRole({ workspace_id, user_id, role_id });
  }

  static async remove({ workspace_id, user_id }) {
    const existing = await Member.isMember(workspace_id, user_id);
    if (!existing) throw new AppError('User is not a member', 404);
    await Member.remove({ workspace_id, user_id });
  }
}

module.exports = MemberService;