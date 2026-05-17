const RoleService = require('../services/role.service');
const { AppError } = require('../middleware/errorHandler');

class RoleController {
  static async create(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const role = await RoleService.create({ workspace_id, ...req.body });
      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        payload: role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByWorkspace(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const roles = await RoleService.getByWorkspace(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Roles fetched',
        payload: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { role_id } = req.params;
      const role = await RoleService.update(role_id, req.body);
      res.status(200).json({
        success: true,
        message: 'Role updated',
        payload: role,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { role_id } = req.params;
      await RoleService.delete(role_id);
      res.status(200).json({
        success: true,
        message: 'Role deleted',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;