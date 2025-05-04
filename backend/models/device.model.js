const connection = require('../config/connect_db');

class Device{
    // CREATE TABLE `device` (
    //     `device_id` int PRIMARY KEY AUTO_INCREMENT,
    //     `room_id` int,
    //     `device_type` enum(PROJECTOR,FAN,AIR_CONDITIONER),
    //     `mac_address` varchar(255) UNIQUE,
    //     `status` enum(OK,WARNING,ERROR,OFFLINE) DEFAULT 'OK'
    //   );
    constructor(device_id, room_id, device_type, mac_address, status = 'OK') {
        this.device_id = device_id;
        this.room_id = room_id;
        this.device_type = device_type;
        this.mac_address = mac_address;
        this.status = status;
    }
    
    static async createDevice(room_id, device_type, mac_address, status = 'OK') {
        try {
        const [result] = await connection.execute(
            `
            INSERT INTO device (room_id, device_type, mac_address, status)
            VALUES (?, ?, ?, ?)
        `,
            [room_id, device_type, mac_address, status]
        );
    
        if (result.affectedRows > 0) {
            console.log("Device created successfully");
            return { success: true, message: "Device created successfully" };
        } else {
            console.log("Failed to create device");
            return { success: false, message: "Failed to create device" };
        }
        } catch (error) {
        console.error("Error creating device:", error);
        throw error;
        }
    }
    
    static async updateDevice(device_id, room_id, device_type, status) {
        try {
        const [result] = await connection.execute(
            `
            UPDATE device
            SET room_id = ?, device_type = ?, status = ?
            WHERE device_id = ?
        `,
            [room_id, device_type, status, device_id]
        );
    
        if (result.affectedRows > 0) {
            console.log("Device updated successfully");
            return { success: true, message: "Device updated successfully" };
        } else {
            console.log("Failed to update device");
            return { success: false, message: "Failed to update device" };
        }
        } catch (error) {
        console.error("Error updating device:", error);
        throw error;
        }
    }
    
    static async deleteDevice(device_id) {
        try {
        const [result] = await connection.execute(
            `
            DELETE FROM device WHERE device_id = ?
        `,
            [device_id]
        );
    
        if (result.affectedRows > 0) {
            console.log("Device deleted successfully");
            return { success: true, message: "Device deleted successfully" };
        } else {
            console.log("Failed to delete device");
            return { success: false, message: "Failed to delete device" };
        }
        } catch (error) {
        console.error("Error deleting device:", error);
        throw error;
        }
    }
    
    static async findDeviceById(device_id) {
        try {
        const [rows] = await connection.execute(
            `
            SELECT * FROM device WHERE device_id = ?
        `,
            [device_id]
        );
    
        if (rows.length === 0) {
            console.log("Device not found");
            return null;
        }
    
        const device = rows[0];
        return new Device(
            device.device_id,
            device.room_id,
            device.device_type,
            device.mac_address,
            device.status
        );
        } catch (error) {
        console.error("Error finding device:", error);
        throw error;
        }
    }
    
    static async findAllDeviceOfRoom(room_id) {
        try {
        const [rows] = await connection.execute(
            `
            SELECT * FROM device WHERE room_id = ?
        `,
            [room_id]
        );
    
        if (rows.length === 0) {
            console.log("No devices found for the room");
            return [];
        }
    
        return rows.map(
            (row) =>
            new Device(
                row.device_id,
                row.room_id,
                row.device_type,
                row.mac_address,
                row.status
            )
        );
        } catch (error) {
        console.error("Error finding devices for the room:", error);
        throw error;
        }
    }

    static async getAllDevices() {
        try {
            const [rows] = await connection.execute(
                `
                SELECT d.*, r.name as room_name
                FROM device d
                LEFT JOIN room r ON d.room_id = r.room_id
                `
            );

            if (rows.length === 0) {
                console.log("No devices found");
                return [];
            }

            return rows.map(row => ({
                device_id: row.device_id,
                room_id: row.room_id,
                room_name: row.room_name,
                device_type: row.device_type,
                mac_address: row.mac_address,
                status: row.status
            }));
        } catch (error) {
            console.error("Error finding all devices:", error);
            throw error;
        }
    }

    // This is the function that's being called by the controller
    static async getDeviceList() {
        try {
            return await this.getAllDevices();
        } catch (error) {
            console.error("Error getting device list:", error);
            throw error;
        }
    }
}

module.exports = Device