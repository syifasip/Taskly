const WorkspaceService = require('../services/workspace.service');
const { AppError } = require('../middleware/errorHandler');

class WorkspaceController {
  static async create(req, res, next) {
    try {
      const { user_id } = req.user;
      const { name, custom_url, color, access_type } = req.body;
      const workspace = await WorkspaceService.create({ name, custom_url, color, access_type, owner_id: user_id });
      res.status(201).json({
        success: true,
        message: 'Workspace created successfully',
        payload: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByUrl(req, res, next) {
    try {
      const { custom_url } = req.params;
      const workspace = await WorkspaceService.getByUrl(custom_url);
      if (!workspace) return next(new AppError('Workspace not found', 404));
      res.status(200).json({
        success: true,
        message: 'Workspace fetched',
        payload: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const workspace = await WorkspaceService.getById(workspace_id);
      if (!workspace) return next(new AppError('Workspace not found', 404));
      res.status(200).json({
        success: true,
        message: 'Workspace fetched',
        payload: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const { name, color, access_type } = req.body;
      const workspace = await WorkspaceService.update(workspace_id, { name, color, access_type });
      res.status(200).json({
        success: true,
        message: 'Workspace updated',
        payload: workspace,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { workspace_id } = req.params;
      await WorkspaceService.delete(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Workspace deleted',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const members = await WorkspaceService.getMembers(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Members fetched',
        payload: members,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateInvite(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const token = await WorkspaceService.generateInviteLink(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Invite link generated',
        payload: {
          invite_token: token,
          invite_url: `${process.env.FRONTEND_URL}/join/${token}`,
          expires_in: '24 hours',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async joinByInvite(req, res, next) {
    try {
      const { invite_token } = req.params;
      const { user_id } = req.user;
      const workspace = await WorkspaceService.joinByInvite(invite_token, user_id);
      res.status(200).json({
        success: true,
        message: 'Successfully joined workspace',
        payload: workspace,
      });
    } catch (error) {
      next(error);
    }
  }
  
}

module.exports = WorkspaceController;