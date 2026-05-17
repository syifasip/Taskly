const TaskService = require('../services/task.service');
const { AppError } = require('../middleware/errorHandler');

class TaskController {
  static async create(req, res, next) {
    try {
      const { user_id } = req.user;
      const { workspace_id } = req.params;
      const { title, description, due_date, priority, is_pinned, color, assignee_id } = req.body;
      const task = await TaskService.create({
        workspace_id, creator_id: user_id,
        title, description, due_date, priority, is_pinned, color, assignee_id
      });
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        payload: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByWorkspace(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const tasks = await TaskService.getByWorkspace(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Tasks fetched',
        payload: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { task_id } = req.params;
      const task = await TaskService.getById(task_id);
      if (!task) return next(new AppError('Task not found', 404));
      res.status(200).json({
        success: true,
        message: 'Task fetched',
        payload: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { task_id } = req.params;
      const task = await TaskService.update(task_id, req.body);
      res.status(200).json({
        success: true,
        message: 'Task updated',
        payload: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { task_id } = req.params;
      await TaskService.delete(task_id);
      res.status(200).json({
        success: true,
        message: 'Task deleted',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPinned(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const tasks = await TaskService.getPinned(workspace_id);
      res.status(200).json({
        success: true,
        message: 'Pinned tasks fetched',
        payload: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const { workspace_id } = req.params;
      const { user_id } = req.user;
      const stats = await TaskService.getStats(workspace_id, user_id);
      res.status(200).json({
        success: true,
        message: 'Task stats fetched',
        payload: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;