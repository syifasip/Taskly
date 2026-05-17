const MemberService = require('../services/member.service');

class MemberController {
  static async add(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const { user_id, role_id } = req.body;
      const member = await MemberService.add({ workspace_id, user_id, role_id });
      res.status(201).json({
        success: true,
        message: 'Member added successfully',
        payload: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByWorkspace(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const members = await MemberService.getByWorkspace(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Members fetched',
        payload: members,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req, res, next) {
    try {
      const { workspace_id, user_id } = req.params;
      const { role_id } = req.body;
      const member = await MemberService.updateRole({ workspace_id, user_id, role_id });
      res.status(200).json({
        success: true,
        message: 'Member role updated',
        payload: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const { workspace_id, user_id } = req.params;
      await MemberService.remove({ workspace_id, user_id });
      res.status(200).json({
        success: true,
        message: 'Member removed',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MemberController;