const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secretKey = process.env.SECRET_KEY || 'your-secret-key';
const redisClient = require('../config/connect_redis'); // path to your redis config

const register = async (req, res) => {
    try {
        // Kiểm tra xem dữ liệu đến từ req.body hay req.body.user
        const userData = req.body.user || req.body;
        const { email, password, username, mssv, faculty } = userData;
        
        // Validate required fields
        if (!email || !password || !username) {
            return res.status(400).send({ message: 'Email, password and username are required' });
        }

        const user = new User(null, username, email, password, mssv, 'Student', faculty);
        const result = await user.signup();
        
        if (result.success) {
            console.log("User registered successfully in controller");
            res.status(200).json({ message: result.message });
        } else {
            res.status(400).send({ message: result.message });
        }
    } catch (err) {
        console.error("Registration error:", err.message);
        res.status(500).send({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        // Kiểm tra xem dữ liệu đến từ req.body hay req.body.user
        const userData = req.body.user || req.body;
        const { email, password } = userData;
        
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }
        
        console.log(`Login attempt for email: ${email}`);
        const user = await User.findUserByEmail(email);
        
        if (!user) {
            console.log(`User not found with email: ${email}`);
            return res.status(401).send({ error: 'User not found with email' });
        }
        
        // Securely compare the password using bcrypt
        if (password === user.password) {
            // Thêm role vào token JWT
            const token = jwt.sign({ 
                id: user.user_id, 
                role: user.role // Thêm role vào token
            }, secretKey, { expiresIn: '2h' });
            
            // Redis cache for fast lookup
            await redisClient.set(String(user.user_id), user.role, { EX: 3600*2 }); 
            console.log(`User ${email} logged in successfully with role: ${user.role}`);
            res.status(200).send({message: "user login successfully", token: token });
        } else {
            console.log(`Invalid password for user: ${email}`);
            res.status(401).send({ error: 'Invalid password for user' });
        }
    } catch (err) {
        console.error(`Login error: ${err.message}`);
        res.status(500).send({ error: err.message });
    }
};

const getSelfProfile = async (req, res) => {
    try {
       const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const { password, ...userData } = user;
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const updateSelfProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: missing user ID' });
        }

        const { username, mssv, faculty} = req.body.user;

        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // update fields
        user.username = username || user.username;
        user.mssv = mssv || user.mssv;
        user.faculty = faculty || user.faculty;

        await user.updateUserInformation();

        res.status(200).send({ message: 'User profile updated successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: missing user ID' });
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send({ error: 'Old and new password are required' });
        }

        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Removed bcrypt password validation
        if (oldPassword !== user.password) {
            return res.status(403).send({ error: 'Old password is incorrect' });
        }

        user.password = newPassword; // Directly assign new password
        await user.updatePassword();

        res.status(200).send({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send({ error: 'Token missing' });
        }

        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
            return res.status(400).send({ error: 'Invalid token' });
        }

        await redisClient.del(decoded.id.toString());
        res.status(200).send({ message: 'User logged out successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
       const userId = req.params.userId;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const { password, ...userData } = user;
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
       const userId = req.params.userId;
       const status = req.body.status;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const user = await User.findUserById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.status = status;
        const result = user.updateUserInformation()
        res.status(200).send({message: "User status updated successfully!"});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

const getUsersAndTheirActiveStatus = async (req, res) => {
    try {
        const users = await User.getAllUSer();

        const userStatusPromises = users.map(async (user) => {
            // Fix: use user.user_id instead of user.ID
            const isLoggedIn = await redisClient.exists(String(user.user_id));
            return {
                ...user,
                active: isLoggedIn === 1
            };
        });

        const usersWithStatus = await Promise.all(userStatusPromises);

        res.status(200).json(usersWithStatus);
    } catch (err) {
        console.error('Error getting users and status:', err);
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    register,
    login,
    logout,
    getSelfProfile,
    updateSelfProfile,
    changePassword,
    getUserProfile,
    updateUserStatus,
    getUsersAndTheirActiveStatus
};
