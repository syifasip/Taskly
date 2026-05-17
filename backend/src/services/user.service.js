const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const redisClient = require('../config/redis');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  static async register({ full_name, email, password }) {
    const existing = await User.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 400);
    const hashed = await bcrypt.hash(password, 10);
    return await User.create({ full_name, email, password: hashed });
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) throw new AppError('Email or password incorrect', 401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Email or password incorrect', 401);

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await redisClient.setEx(
      `session:${token}`,
      3600,
      JSON.stringify({ user_id: user.user_id, email: user.email })
    );

    return {
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
      }
    };
  }

  static async findById(id) {
    return await User.findById(id);
  }

  static async updateProfile(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await User.update(id, data);
  }

  static async getWorkspaces(userId) {
    return await User.getWorkspaces(userId);
  }

  static async getAssignedTasks(userId) {
    return await User.getAssignedTasks(userId);
  }

  static async getStats(userId) {
    return await User.getStats(userId);
  }

  static async getTasksPerWorkspace(userId) {
    return await User.getTasksPerWorkspace(userId);
  }

  static async getUpcomingDeadlines(userId, days) {
    return await User.getUpcomingDeadlines(userId, days);
  }
}

module.exports = UserService;