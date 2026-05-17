const Task = require('../models/task.model');
const ActivityLog = require('../models/activity_log.model');
const RedisService = require('./redis.service');
const { AppError } = require('../middleware/errorHandler');

class TaskService {
  static async create(data) {
    const task = await Task.create(data);

    // set reminder di Redis kalau ada due_date
    if (data.due_date) {
      const ttl = Math.floor((new Date(data.due_date) - new Date()) / 1000) - 3600;
      if (ttl > 0) {
        await RedisService.setReminder(task.task_id, data.creator_id, ttl);
      }
    }

    // log activity
    await ActivityLog.create({
      workspace_id: data.workspace_id,
      user_id: data.creator_id,
      action: 'created',
      target_title: data.title,
    });

    // publish ke Live Activity
    await RedisService.publishActivity(data.workspace_id, {
      user_id: data.creator_id,
      action: 'created',
      target_title: data.title,
      created_at: new Date(),
    });

    return task;
  }

  static async getByWorkspace(workspace_id) {
    return await Task.findByWorkspace(workspace_id);
  }

  static async getById(task_id) {
    return await Task.findById(task_id);
  }

  static async update(task_id, data) {
    const existing = await Task.findById(task_id);
    if (!existing) throw new AppError('Task not found', 404);

    const task = await Task.update(task_id, data);

    // log activity kalau status berubah jadi completed
    if (data.status === 'completed' && existing.status !== 'completed') {
      await ActivityLog.create({
        workspace_id: existing.workspace_id,
        user_id: existing.creator_id,
        action: 'completed',
        target_title: existing.title,
      });

      await RedisService.publishActivity(existing.workspace_id, {
        user_id: existing.creator_id,
        action: 'completed',
        target_title: existing.title,
        created_at: new Date(),
      });
    }

    return task;
  }

  static async delete(task_id) {
    const existing = await Task.findById(task_id);
    if (!existing) throw new AppError('Task not found', 404);
    await Task.delete(task_id);
  }

  static async getPinned(workspace_id) {
    return await Task.getPinned(workspace_id);
  }

  static async getStats(workspace_id, user_id) {
    const StatsService = require('./stats.service');
    const byStatus = await StatsService.getTasksByStatus(workspace_id);
    const byWorkspace = await StatsService.getTasksByWorkspace(user_id);
    const onTime = await StatsService.getOnTimeRate(user_id);
    const monthly = await StatsService.getMonthlyCompleted(user_id);
    return { byStatus, byWorkspace, onTime, monthly };
  }
}

module.exports = TaskService;