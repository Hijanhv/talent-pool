import Redis from 'ioredis';

// Redis client for caching
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  enableReadyCheck: false,
  enableOfflineQueue: true,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Redis connected');
});

export default redis;

// Cache key generators
export const CACHE_KEYS = {
  event: (eventId: string) => `event:${eventId}`,
  eventsList: (page: number, limit: number) => `events:list:${page}:${limit}`,
  eventsByOrganizer: (organizerAddress: string, page: number) => `events:organizer:${organizerAddress}:${page}`,
  eventAttendees: (eventId: string, page: number) => `event:${eventId}:attendees:${page}`,
  eventStats: (eventId: string) => `event:${eventId}:stats`,
} as const;

// Cache utilities
export const cache = {
  /**
   * Get a value from cache
   */
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Set a value in cache with optional expiration
   */
  set: async <T>(key: string, value: T, expirationSeconds: number = 3600): Promise<void> => {
    try {
      await redis.setex(key, expirationSeconds, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  },

  /**
   * Delete a key from cache
   */
  del: async (key: string | string[]): Promise<void> => {
    try {
      if (Array.isArray(key)) {
        await redis.del(...key);
      } else {
        await redis.del(key);
      }
    } catch (error) {
      console.error(`Cache delete error:`, error);
    }
  },

  /**
   * Clear all cache keys matching a pattern
   */
  clearPattern: async (pattern: string): Promise<void> => {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache clear pattern error for ${pattern}:`, error);
    }
  },

  /**
   * Increment a counter
   */
  increment: async (key: string, amount: number = 1): Promise<number> => {
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  },

  /**
   * Decrement a counter
   */
  decrement: async (key: string, amount: number = 1): Promise<number> => {
    try {
      return await redis.decrby(key, amount);
    } catch (error) {
      console.error(`Cache decrement error for key ${key}:`, error);
      return 0;
    }
  },
};
