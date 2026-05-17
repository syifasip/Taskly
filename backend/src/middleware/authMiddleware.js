const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const redisClient = require('../config/redis');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return next(new AppError('Access token is required', 401));

  // cek session di Redis dulu
  const cached = await redisClient.get(`session:${token}`);
  if (!cached) return next(new AppError('Session expired, please login again', 401));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new AppError('Invalid or expired token', 401));
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };