import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!redis && process.env.REDIS_URL) {
    try {
      redis = new Redis(process.env.REDIS_URL);

      redis.on('connect', () => {
        logger.info('✅ Connected to Redis');
      });

      redis.on('error', (err) => {
        logger.error('❌ Redis connection error:', err);
      });
    } catch (error) {
      logger.error('❌ Failed to connect to Redis:', error);
    }
  }

  return redis;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.disconnect();
    redis = null;
  }
};
