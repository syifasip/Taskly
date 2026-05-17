const redisClient = require('../config/redis');

class RedisService {
  // 1. Cache JWT session
  static async cacheSession(token, userData) {
    await redisClient.setEx(
      `session:${token}`,
      3600,
      JSON.stringify(userData)
    );
  }

  static async getSession(token) {
    const data = await redisClient.get(`session:${token}`);
    return data ? JSON.parse(data) : null;
  }

  static async deleteSession(token) {
    await redisClient.del(`session:${token}`);
  }

  // 2. TTL reminder deadline
  static async setReminder(task_id, user_id, ttlSeconds) {
    await redisClient.setEx(
      `reminder:${task_id}:${user_id}`,
      ttlSeconds,
      'pending'
    );
  }

  static async getReminder(task_id, user_id) {
    return await redisClient.get(`reminder:${task_id}:${user_id}`);
  }

  static async deleteReminder(task_id, user_id) {
    await redisClient.del(`reminder:${task_id}:${user_id}`);
  }

  // 3. Pub/Sub untuk Discuss dan Live Activity
  static async publishMessage(workspace_id, message) {
    await redisClient.publish(
      `workspace:${workspace_id}:messages`,
      JSON.stringify(message)
    );
  }

  static async publishActivity(workspace_id, activity) {
    await redisClient.publish(
      `workspace:${workspace_id}:activity`,
      JSON.stringify(activity)
    );
  }
}

module.exports = RedisService;