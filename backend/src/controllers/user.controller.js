const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');

class UserController {
  static async register(req, res, next) {
    try {
      const { full_name, email, password } = req.body;
      const user = await UserService.register({ full_name, email, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { user_id } = req.user;
      const user = await UserService.findById(user_id);
      if (!user) return next(new AppError('User not found', 404));
      res.status(200).json({
        success: true,
        message: 'Profile fetched',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { user_id } = req.user;
      const { full_name, email, password } = req.body;
      const updated = await UserService.updateProfile(user_id, { full_name, email, password });
      res.status(200).json({
        success: true,
        message: 'Profile updated',
        payload: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWorkspaces(req, res, next) {
    try {
      const { user_id } = req.user;
      const workspaces = await UserService.getWorkspaces(user_id);
      res.status(200).json({
        success: true,
        message: 'Workspaces fetched',
        payload: workspaces,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignedTasks(req, res, next) {
    try {
      const { user_id } = req.user;
      const tasks = await UserService.getAssignedTasks(user_id);
      res.status(200).json({
        success: true,
        message: 'Assigned tasks fetched',
        payload: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const { user_id } = req.user;
      const stats = await UserService.getStats(user_id);
      res.status(200).json({
        success: true,
        message: 'Stats fetched',
        payload: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUpcomingDeadlines(req, res, next) {
    try {
      const { user_id } = req.user;
      const { days } = req.query;
      const deadlines = await UserService.getUpcomingDeadlines(user_id, days || 7);
      res.status(200).json({
        success: true,
        message: 'Upcoming deadlines fetched',
        payload: deadlines,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;