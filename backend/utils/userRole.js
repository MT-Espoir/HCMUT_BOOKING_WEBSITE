const redisClient = require('../config/redis');

const getUserRole = async (userId) => {
    try {
        const role = await redisClient.get(String(userId));
        return role; // Returns null if not found
    } catch (err) {
        console.error('Redis read error:', err);
        return null;
    }
};
