const device_model = require('../models/device.model');
const Room = require('../models/room.model');

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

/**
 * Update device status
 * @param {Object} req - Request object with deviceId parameter and status in body
 * @param {Object} res - Response object
 */
const updateDeviceStatus = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { status } = req.body;
        
        if (!deviceId) {
            return res.status(400).send({ success: false, error: "Device ID is required" });
        }
        
        if (!status) {
            return res.status(400).send({ success: false, error: "Status is required" });
        }
        
        // Get current valid statuses from database schema
        // For now, use the enum values we know are in the schema
        const validStatuses = ['OK', 'WARNING', 'ERROR', 'OFFLINE'];
        
        // Check if MAINTENANCE status is requested but not supported in DB yet
        let statusToUpdate = status;
        let isMaintenanceRequested = status === 'MAINTENANCE';
        
        // If MAINTENANCE is requested but not in valid statuses, use OFFLINE temporarily
        if (isMaintenanceRequested && !validStatuses.includes('MAINTENANCE')) {
            statusToUpdate = 'OFFLINE'; // Use OFFLINE as a substitute until schema is updated
            console.log(`MAINTENANCE status not in schema yet, using OFFLINE as temporary substitute`);
        } else if (!validStatuses.includes(status)) {
            return res.status(400).send({ 
                success: false, 
                error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` 
            });
        }
        
        // Get device to find its room
        const device = await device_model.findDeviceById(deviceId);
        if (!device) {
            return res.status(404).send({ success: false, error: "Device not found" });
        }
        
        // Update device status
        const updateResult = await device_model.updateDevice(
            deviceId,
            device.room_id,
            device.device_type,
            statusToUpdate
        );
        
        if (!updateResult.success) {
            return res.status(500).send({ success: false, error: "Failed to update device status" });
        }
        
        // If status is being changed to/from MAINTENANCE (or our temporary substitute),
        // update room status
        const roomId = device.room_id;
        if (roomId && (isMaintenanceRequested || statusToUpdate === 'OFFLINE')) {
            try {
                // Get all devices in the room
                const devices = await device_model.findAllDeviceOfRoom(roomId);
                
                // Get the room
                const room = await Room.findRoomById(roomId);
                if (room) {
                    // Check if any devices are in maintenance (using OFFLINE as substitute until schema updated)
                    const hasMaintenanceDevice = devices.some(device => 
                        device && (device.status === 'OFFLINE' || device.status === 'MAINTENANCE'));
                    
                    // If a device is in maintenance, set room status to 'MAINTENANCE' or 'UNAVAILABLE'
                    // depending on what's supported in the schema
                    if (hasMaintenanceDevice && room.status === 'AVAILABLE') {
                        // Try MAINTENANCE first, fall back to UNAVAILABLE if needed
                        try {
                            room.status = 'MAINTENANCE';
                            await room.update();
                            console.log(`Room ${roomId} status updated to ${room.status}`);
                        } catch (err) {
                            // If MAINTENANCE failed, try UNAVAILABLE
                            console.log(`MAINTENANCE status not supported for room, using UNAVAILABLE instead`);
                            room.status = 'UNAVAILABLE';
                            await room.update();
                            console.log(`Room ${roomId} status updated to ${room.status}`);
                        }
                    } else if (!hasMaintenanceDevice && 
                               (room.status === 'MAINTENANCE' || room.status === 'UNAVAILABLE')) {
                        room.status = 'AVAILABLE';
                        await room.update();
                        console.log(`Room ${roomId} status updated to ${room.status}`);
                    }
                }
            } catch (roomErr) {
                console.error(`Error updating room status: ${roomErr.message}`);
                // Don't fail the device update if room update fails
            }
        }
        
        // Respond with success - use the requested status in the response even if we
        // had to use a different value in the database
        res.status(200).send({ 
            success: true, 
            message: `Device ${deviceId} status updated to ${status}`,
            device: {
                id: deviceId,
                room_id: device.room_id,
                device_type: device.device_type,
                status: status // Return the requested status, not necessarily what's in DB
            },
            note: isMaintenanceRequested && statusToUpdate !== 'MAINTENANCE' ? 
                  "MAINTENANCE status was recorded as OFFLINE in the database. Run the SQL migration to update the schema." : 
                  undefined
        });
    } catch (err) {
        console.error(`Error updating device status for ${req.params.deviceId}:`, err);
        res.status(500).send({ success: false, error: err.message });
    }
};

module.exports = {
    getDeviceList,
    getDevicesByRoom,
    updateDeviceStatus
};