const redis = require('redis');

// Create a mock Redis client with no-op functions
const mockClient = {
  get: async () => null,
  set: async () => null,
  del: async () => null,
  hget: async () => null,
  hset: async () => null,
  hgetall: async () => ({}),
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  isConnected: false,
  isReady: false
};

// Environment variable check for Redis enable/disable
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

// Redis connection configuration
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
const CONNECTION_TIMEOUT = 5000; // 5 seconds timeout

let client;

// Only attempt to connect if Redis is enabled
if (REDIS_ENABLED) {
  try {
    console.log(`Attempting to connect to Redis at ${REDIS_HOST}:${REDIS_PORT}...`);
    
    // Create Redis client with improved configuration
    client = redis.createClient({
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        reconnectStrategy: (retries) => {
          // Reconnect after increasing delay, max 3 attempts
          if (retries > 3) {
            console.log('Max reconnection attempts reached, using mock Redis client');
            return false; // Stop trying to reconnect
          }
          return Math.min(retries * 200, 1000); // Reconnect delay in ms
        }
      },
      password: REDIS_PASSWORD || undefined
    });
    
    // Only log the first error
    let errorLogged = false;
    client.on('error', (err) => {
      if (!errorLogged) {
        console.error('Redis connection failed:', err.message);
        console.log('Switching to mock Redis client...');
        errorLogged = true;
        
        // Replace the client with our mock
        client = mockClient;
      }
    });
    
    // Set a timeout for the initial connection attempt
    const connectionPromise = client.connect().then(() => {
      console.log('Connected to Redis successfully');
      client.isConnected = true;
      return client;
    });
    
    // If connection takes too long, use mock client
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        if (!client.isConnected) {
          console.log(`Redis connection timeout after ${CONNECTION_TIMEOUT}ms, using mock Redis client`);
          resolve(mockClient);
        }
      }, CONNECTION_TIMEOUT);
    });
    
    // Use either the actual connection or the mock if timeout occurs
    Promise.race([connectionPromise, timeoutPromise])
      .catch((err) => {
        console.log('Using mock Redis client due to connection error:', err.message);
        client = mockClient;
      });
  } catch (error) {
    console.error('Error initializing Redis:', error.message);
    console.log('Using mock Redis client...');
    client = mockClient;
  }
} else {
  console.log('Redis is disabled, using mock Redis client');
  client = mockClient;
}

module.exports = client;
