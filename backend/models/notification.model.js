const db = require('../config/connect_db');

class Notification{
    // CREATE TABLE `notification` (
    //     `noti_id` integer PRIMARY KEY,
    //     `user_id` integer,
    //     `type` enum COMMENT 'REMINDER', 'ALERT', 'SYSTEM', 'REPORT'
    //     `description` varchar(255),
    //     `sent_at` timestamp
    //     `read` boolean
    //   );
    constructor(noti_id, user_id, type, description, sent_at, read = false) {
        this.noti_id = noti_id;
        this.user_id = user_id;
        this.type = type;
        this.description = description;
        this.sent_at = sent_at;
        this.read = read;
    }
    
    // Create a new notification
    async createNotification() {
        try {
        const sent_at = new Date().toISOString();
        const [result] = await db.execute(
            `
            INSERT INTO notification (user_id, type, description, sent_at, read)
            VALUES (?, ?, ?, ?, ?)
        `,
            [this.user_id, this.type, this.description, this.sent_at, false]
        );
    
        if (result.affectedRows > 0) {
            console.log("Notification created successfully");
            return { success: true, message: "Notification created successfully" };
        } else {
            console.log("Failed to create notification");
            return { success: false, message: "Failed to create notification" };
        }
        } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
        }
    }
    
    // Update the read status of a notification
    async updateNotiStatus() {
        try {
        const [result] = await db.execute(
            `
            UPDATE notification
            SET read = ?
            WHERE noti_id = ?
        `,
            [this.readStatus, this.noti_id]
        );
    
        if (result.affectedRows > 0) {
            console.log("Notification status updated successfully");
            return { success: true, message: "Notification status updated successfully" };
        } else {
            console.log("Failed to update notification status");
            return { success: false, message: "Failed to update notification status" };
        }
        } catch (error) {
        console.error("Error updating notification status:", error);
        throw error;
        }
    }
    
    // Find a notification by its ID
    static async findNotificationById(noti_id) {
        try {
        const [rows] = await db.execute(
            `
            SELECT * FROM notification WHERE noti_id = ?
        `,
            [noti_id]
        );
    
        if (rows.length === 0) {
            console.log("Notification not found");
            return null;
        }
    
        const noti = rows[0];
        return new Notification(
            noti.noti_id,
            noti.user_id,
            noti.type,
            noti.description,
            noti.sent_at,
            noti.read
        );
        } catch (error) {
        console.error("Error finding notification:", error);
        throw error;
        }
    }
    
    // Find all notifications for a specific user
    static async findAllNotificationsByUser(user_id) {
        try {
        const [rows] = await db.execute(
            `
            SELECT * FROM notification WHERE user_id = ?
        `,
            [user_id]
        );
    
        if (rows.length === 0) {
            console.log("No notifications found for the user");
            return [];
        }
    
        return rows.map(
            (row) =>
            new Notification(
                row.noti_id,
                row.user_id,
                row.type,
                row.description,
                row.sent_at,
                row.read
            )
        );
        } catch (error) {
        console.error("Error finding notifications for the user:", error);
        throw error;
        }
    }
    
    // Find all unread notifications for a specific user
    static async findUnreadNotificationsByUser(user_id) {
        try {
        const [rows] = await db.execute(
            `
            SELECT * FROM notification WHERE user_id = ? AND read = 0
        `,
            [user_id]
        );
    
        if (rows.length === 0) {
            console.log("No unread notifications for the user");
            return [];
        }
    
        return rows.map(
            (row) =>
            new Notification(
                row.noti_id,
                row.user_id,
                row.type,
                row.description,
                row.sent_at,
                row.read
            )
        );
        } catch (error) {
        console.error("Error finding unread notifications for the user:", error);
        throw error;
        }
    }

}

module.exports = Notification