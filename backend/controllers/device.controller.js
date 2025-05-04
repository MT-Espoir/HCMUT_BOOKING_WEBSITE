const device_model = require('../models/device.model');

const getDeviceList = async (req, res) => {
    try {
        const devices = await device_model.getDeviceList(req.user ? req.user.ID : null);
        res.status(200).send({success: true, devices: devices, message: "get device list successfully"});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

/**
 * Get devices by room ID
 * @param {Object} req - Request object with roomId parameter
 * @param {Object} res - Response object
 */
const getDevicesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        if (!roomId) {
            return res.status(400).send({ success: false, error: "Room ID is required" });
        }
        
        // Sử dụng connection trực tiếp để lấy dữ liệu đầy đủ
        const connection = require('../config/connect_db');
        const [devices] = await connection.execute(`
            SELECT d.*, r.name as room_name 
            FROM device d
            LEFT JOIN room r ON d.room_id = r.room_id
            WHERE d.room_id = ?
        `, [roomId]);
        
        // Nếu không có thiết bị, trả về mảng rỗng
        if (!devices || devices.length === 0) {
            return res.status(200).send({ 
                success: true, 
                devices: [], 
                message: `No devices found for room ${roomId}` 
            });
        }
        
        // Trả về danh sách thiết bị theo định dạng mà frontend mong đợi
        res.status(200).send({ 
            success: true, 
            devices: devices, 
            message: `Retrieved ${devices.length} devices for room ${roomId} successfully` 
        });
    } catch (err) {
        console.error(`Error fetching devices for room ${req.params.roomId}:`, err);
        res.status(500).send({ success: false, error: err.message });
    }
};

module.exports = {
    getDeviceList,
    getDevicesByRoom,
};