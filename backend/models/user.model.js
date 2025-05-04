const connection = require('../config/connect_db');
// Removed bcrypt import

class User{
	// this is the design for user table in mysql database
  // `user_id` integer PRIMARY KEY AUTO_INCREMENT,
  // `username` varchar(255),
  // `email` varchar(255),
  // `password` varchar(255),
  // `mssv` varchar(255) UNIQUE,
  // `role` enum COMMENT 'STUDENT, ADMIN, TECHNICIAN, MANAGER',
  // `faculty` varchar(255),
  // `created_at` timestamp DEFAULT (current_timestamp),
  // `status` enum DEFAULT 'ACTIVE' COMMENT 'ACTIVE, RESTRICTED, BANNED'
    constructor (user_id, username, email, password, mssv, role, faculty, created_at, last_login, status){
        this.user_id = user_id
        this.username =  username
        this.email = email
        this.password = password
        this.mssv = mssv
        this.role = role
        this.faculty = faculty
        this.created_at = created_at
        this.last_login = last_login
        this.status = status
    }

    async signup() {
        try {
            // Insert the user information into the database without hashing the password
            const [result] = await connection.execute(
                `
                INSERT INTO user (username, email, password, mssv, role, faculty, created_at, status)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
            `,
                [
                    this.username || null, 
                    this.email || null, 
                    this.password, // Directly store the password
                    this.mssv || null, 
                    this.role || 'STUDENT', 
                    this.faculty || null, 
                    this.status || 'ACTIVE'
                ]
            );
        
            // Check if the insertion was successful
            if (result.affectedRows > 0) {
                console.log("User registered successfully");
                return { success: true, message: "User registered successfully" };
            } else {
                console.log("Failed to register user");
                return { success: false, message: "Failed to register user" };
            }
        } catch (error) {
            console.error("Error during user registration:", error);
            throw error; // You might want to handle the error more gracefully
        }
    }

    static async findUserById(userId) {
        try {
        const [rows] = await connection.execute(
            `
            SELECT * FROM user 
            WHERE user_id = ?
            `,
            [userId]
        );
    
        if (rows.length === 0) {
            console.log("User not found");
            return null;
        }
    
        const row = rows[0];
    
        return new User(
            row.user_id,
            row.username,
            row.email,
            row.password,
            row.mssv,
            row.role,
            row.faculty,
            row.created_at,
            row.last_login,
            row.status
        );
        } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
        }
    }
    
    static async findUserByEmail(email) {
        try {
          const [rows] = await connection.execute(
            `
            SELECT * FROM user 
            WHERE email = ?
            `,
            [email]
          );
      
          if (rows.length === 0) {
            console.log("User not found with email:", email);
            return null;
          }
      
          const row = rows[0];
      
          return new User(
            row.user_id,
            row.username,
            row.email,
            row.password,
            row.mssv,
            row.role,
            row.faculty,
            row.created_at,
            row.last_login,
            row.status
          );
        } catch (error) {
          console.error("Error finding user by email:", error);
          throw error;
        }
    }

    async userAlreadyExists(email) {
        try {
        const [rows] = await connection.execute(
            'SELECT COUNT(*) as count FROM user WHERE email = ?',
            [email]
        );

        const userCount = rows[0].count;

        return userCount > 0;
        } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
        }
    }

    hasMatchingPassword(hashedPassword) {
        // Removed bcrypt comparison logic
        return this.password === hashedPassword;
    }

    async updateUserInformation() {
        try {
            // Update user information in the database based on user_id
            await connection.execute(
                `
                UPDATE user 
                SET username = ?, email = ?, mssv = ?, role = ?, faculty = ?, status = ?, last_login = ?
                WHERE user_id = ?
                `,
                [
                    this.username || null,
                    this.email || null,
                    this.mssv || null,
                    this.role || 'STUDENT',
                    this.faculty || null,
                    this.status || 'ACTIVE',
                    this.last_login || null,
                    this.user_id
                ]
            );
            console.log("User information updated successfully");
        } catch (error) {
            console.error("Error updating user information:", error);
            throw error;
        }
    }

    async updatePassword() {
        try {
            // Removed password hashing logic
            await connection.execute(
                `
                UPDATE user 
                SET password = ?
                WHERE user_id = ?
                `,
                [this.password, this.user_id]
            );

            console.log("Password updated successfully");
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }

    async deleteUser() {
        try {
          await connection.execute(
            `
            DELETE FROM user 
            WHERE user_id = ?
            `,
            [this.user_id]
          );
      
          console.log("User deleted successfully");
        } catch (error) {
          console.error("Error deleting user:", error);
          throw error;
        }
    }

    static async getAllUSer(){
        try {
            const [rows] = await connection.execute('SELECT * FROM user');
            return rows.map(
                (row) => new User(
                    row.user_id,
                    row.username,
                    row.email,
                    null,
                    row.mssv,
                    row.role,
                    row.faculty,
                    row.created_at,
                    row.last_login,
                    row.status
                  )
                
            );
        } catch (err) {
            console.error('Error fetching users:', err);
            throw err;
        }
    }

};

module.exports = User;