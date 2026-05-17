const UserService = require('../services/user.service');
const redisClient = require('../config/redis');

class AuthController {
  static async register(req, res, next) {
    try {
      const { full_name, email, password } = req.body;
      const result = await UserService.register({ full_name, email, password });
      res.status(201).json({
        success: true,
        message: 'Register successful',
        payload: result,
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

  static async logout(req, res, next) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (token) await redisClient.del(`session:${token}`);
      res.status(200).json({
        success: true,
        message: 'Logout successful',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;