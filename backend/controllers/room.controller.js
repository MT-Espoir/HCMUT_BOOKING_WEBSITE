const Room = require('../models/room.model');

/**
 * Get all rooms with optional filtering
 */
const getRooms = async (req, res) => {
    try {
        // Extract filter criteria from query parameters
        const filters = {
            capacity: req.query.capacity,
            area: req.query.area,
            status: req.query.status || 'AVAILABLE',
            building: req.query.building,
            floor: req.query.floor,
            roomType: req.query.roomType,
            date: req.query.date, // Lấy ngày từ query params
            excludeBookingId: req.query.excludeBookingId // Thêm ID booking cần loại trừ
        };
        
        // Thêm thời gian vào filters nếu có (quan trọng để kiểm tra chồng chéo thời gian)
        if (req.query.startTime && req.query.endTime) {
            filters.startTime = req.query.startTime;
            filters.endTime = req.query.endTime;
            console.log(`Filtering with time range: ${filters.startTime} - ${filters.endTime}`);
            
            if (filters.excludeBookingId) {
                console.log(`Excluding booking ID: ${filters.excludeBookingId} from availability check`);
            }
        }
        
        // Get all rooms matching basic filters
        const rooms = await Room.findAll(filters);
        
        // Log debug
        console.log(`Found ${rooms.length} rooms matching basic filters`);
        
        // Xử lý lọc phòng theo khung giờ hoạt động
        if (req.query.startTime && req.query.endTime) {
            const startTime = req.query.startTime;
            const endTime = req.query.endTime;
            
            // Debug log
            console.log(`Filtering rooms by time range: ${startTime} - ${endTime}`);
            
            // Check each room's availability for the requested time
            for (const room of rooms) {
                // Log special info for room B1-101
                if (room.name && room.name.includes('B1-101')) {
                    console.log('------- B1-101 ROOM INFO -------');
                    console.log('Room data:', {
                        id: room.id,
                        name: room.name,
                        status: room.status,
                        openingHours: room.openingHours
                    });
                }
                
                // Add availability status to each room based on opening hours
                room.isAvailableForTimeRange = Room.isWithinOpeningHours(
                    room.openingHours, 
                    startTime, 
                    endTime
                );
                
                // Log special info for B1-101 result
                if (room.name && room.name.includes('B1-101')) {
                    console.log(`B1-101 is ${room.isAvailableForTimeRange ? 'AVAILABLE' : 'NOT AVAILABLE'} for this time range`);
                    console.log('------- END B1-101 INFO -------');
                }
            }
        } else {
            // If no time filter, all rooms are considered available from the opening hours perspective
            for (const room of rooms) {
                room.isAvailableForTimeRange = true;
            }
        }
        
        res.status(200).json({ success: true, data: rooms });
    } catch (err) {
        console.error('Error fetching rooms:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Get details for a specific room
 */
const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findRoomById(roomId);
        
        if (!room) {
            return res.status(404).send({ error: 'Room not found' });
        }
        
        res.status(200).json({ success: true, data: room });
    } catch (err) {
        console.error(`Error fetching room ${req.params.roomId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Create a new room (Admin only)
 */
const createRoom = async (req, res) => {
    try {
        const { name, location, floor, building, capacity, area, roomType, description, facilities, openingHours, status } = req.body;
        
        // Validate required fields
        if (!name || !location || !capacity || !area || !roomType) {
            return res.status(400).send({ error: 'Missing required fields' });
        }
        
        // Create room object
        const room = new Room(
            null,
            name,
            location,
            floor,
            building,
            capacity,
            area,
            roomType,
            req.body.roomImage,
            description,
            facilities,
            openingHours,
            status || 'AVAILABLE'
        );
        
        const result = await room.save();
        
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Update an existing room (Admin only)
 */
const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { name, location, floor, building, capacity, area, roomType, roomImage, description, facilities, openingHours, status } = req.body;
        
        const existingRoom = await Room.findRoomById(roomId);
        
        if (!existingRoom) {
            return res.status(404).send({ error: 'Room not found' });
        }
        
        // Update fields if provided, otherwise keep existing values
        existingRoom.name = name || existingRoom.name;
        existingRoom.location = location || existingRoom.location;
        existingRoom.floor = floor !== undefined ? floor : existingRoom.floor;
        existingRoom.building = building || existingRoom.building;
        existingRoom.capacity = capacity !== undefined ? capacity : existingRoom.capacity;
        existingRoom.area = area !== undefined ? area : existingRoom.area;
        existingRoom.roomType = roomType || existingRoom.roomType;
        existingRoom.roomImage = roomImage || existingRoom.roomImage;
        existingRoom.description = description || existingRoom.description;
        existingRoom.facilities = facilities || existingRoom.facilities;
        existingRoom.openingHours = openingHours || existingRoom.openingHours;
        existingRoom.status = status || existingRoom.status;
        
        const result = await existingRoom.update();
        
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error(`Error updating room ${req.params.roomId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Search rooms by keyword
 */
const searchRooms = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).send({ error: 'Search query is required' });
        }
        
        const rooms = await Room.searchByKeyword(query);
        
        res.status(200).json({ success: true, data: rooms });
    } catch (err) {
        console.error('Error searching rooms:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Check room availability for a specific time period
 */
const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { startTime, endTime } = req.query;
        
        if (!startTime || !endTime) {
            return res.status(400).send({ error: 'Start time and end time are required' });
        }
        
        // Debug log để kiểm tra thời gian nhận được
        console.log(`Checking availability for room ${roomId}:`, {
            startTime,
            endTime,
            startTimeObj: new Date(startTime),
            endTimeObj: new Date(endTime)
        });
        
        const isAvailable = await Room.checkAvailability(roomId, startTime, endTime);
        
        res.status(200).json({ 
            success: true, 
            data: { 
                available: isAvailable,
                roomId,
                startTime,
                endTime
            } 
        });
    } catch (err) {
        console.error(`Error checking availability for room ${req.params.roomId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Get available rooms for a specific time period
 */
const getAvailableRooms = async (req, res) => {
    try {
        const { startTime, endTime, date } = req.query;
        
        if (!startTime || !endTime) {
            return res.status(400).send({ error: 'Start time and end time are required' });
        }
        
        // Tạo datetime đầy đủ nếu có date
        let fullStartTime = startTime;
        let fullEndTime = endTime;
        
        if (date) {
            // Nếu có tham số date, kết hợp với thời gian để tạo datetime đầy đủ
            fullStartTime = `${date}T${startTime}`;
            fullEndTime = `${date}T${endTime}`;
        }
        
        // Extract additional filters
        const filters = {
            capacity: req.query.capacity,
            area: req.query.area,
            building: req.query.building,
            floor: req.query.floor,
            roomType: req.query.roomType,
            date: date // Thêm date vào filters
        };
        
        // Lấy danh sách phòng khả dụng từ model (không bị trùng lịch đặt phòng)
        const availableRooms = await Room.getAvailableRooms(fullStartTime, fullEndTime, filters);
        
        // Lọc thêm dựa trên giờ hoạt động của phòng
        const roomsWithinHours = availableRooms.filter(room => 
            Room.isWithinOpeningHours(room.openingHours, fullStartTime, fullEndTime)
        );
        
        res.status(200).json({
            success: true,
            data: roomsWithinHours
        });
    } catch (err) {
        console.error('Error getting available rooms:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Filter rooms with additional checks
 */
const filterRooms = async (req, res) => {
    try {
        // Trích xuất các filter từ query parameters
        const { capacity, date, building, timeRange, startTime, endTime } = req.query;
        
        // Kiểm tra thời gian quá khứ
        if (startTime && endTime) {
            const now = new Date();
            let requestStartTime;
            
            // Xử lý định dạng datetime
            if (date) {
                requestStartTime = new Date(`${date}T${startTime}`);
            } else if (startTime.includes('T') || startTime.includes(' ')) {
                requestStartTime = new Date(startTime);
            } else {
                // Nếu chỉ có giờ, sử dụng ngày hiện tại
                const today = new Date().toISOString().split('T')[0];
                requestStartTime = new Date(`${today}T${startTime}`);
            }
            
            // Kiểm tra nếu thời gian đã qua
            if (requestStartTime < now) {
                return res.status(400).json({
                    success: false,
                    error: 'Không thể đặt phòng cho thời gian đã qua',
                    data: []
                });
            }
        }
        
        // Kiểm tra nếu ngày đã qua
        if (date) {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                return res.status(400).json({
                    success: false,
                    error: 'Không thể đặt phòng cho ngày đã qua',
                    data: []
                });
            }
        }
        
        // Tạo object filter để sử dụng trong truy vấn
        const filters = {
            capacity: capacity ? parseInt(capacity) : undefined,
            date: date,
            building: building,
        };
        
        // Xử lý khoảng thời gian cụ thể nếu có
        if (timeRange) {
            // Chuyển đổi định dạng "7h - 9h" thành giờ bắt đầu và kết thúc
            const [start, end] = timeRange.split(' - ');
            filters.startTime = start.replace('h', ':00');
            filters.endTime = end.replace('h', ':00');
        } else if (startTime && endTime) {
            filters.startTime = startTime;
            filters.endTime = endTime;
        }
        
        // Lấy danh sách phòng phù hợp với các filter
        const rooms = await Room.findAll(filters);
        
        // Nếu không có filter thời gian, trả về danh sách phòng ngay
        if (!timeRange && !startTime && !endTime) {
            return res.status(200).json({ success: true, data: rooms });
        }
        
        // Thêm thông tin khả dụng dựa trên khung giờ cho mỗi phòng
        for (const room of rooms) {
            // Chuẩn bị các tham số thời gian
            let roomStartTime = filters.startTime;
            let roomEndTime = filters.endTime;
            
            // Nếu có date, kết hợp với thời gian
            if (date) {
                roomStartTime = `${date}T${filters.startTime}`;
                roomEndTime = `${date}T${filters.endTime}`;
            }
            
            // Kiểm tra xem phòng có khả dụng trong khung giờ không
            room.isAvailableForTimeRange = await Room.isWithinOpeningHours(
                room.openingHours,
                roomStartTime,
                roomEndTime
            );
        }
        
        res.status(200).json({ success: true, data: rooms });
    } catch (err) {
        console.error('Error filtering rooms:', err);
        res.status(500).json({ success: false, error: err.message, data: [] });
    }
};

module.exports = {
    getRooms,
    getRoomDetails,
    createRoom,
    updateRoom,
    searchRooms,
    checkRoomAvailability,
    getAvailableRooms,
    filterRooms
};