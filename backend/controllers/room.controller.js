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
            roomType: req.query.roomType
        };
        
        const rooms = await Room.findAll(filters);
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
        const { startTime, endTime } = req.query;
        
        if (!startTime || !endTime) {
            return res.status(400).send({ error: 'Start time and end time are required' });
        }
        
        // Extract additional filters
        const filters = {
            capacity: req.query.capacity,
            area: req.query.area,
            building: req.query.building,
            floor: req.query.floor,
            roomType: req.query.roomType
        };
        
        const availableRooms = await Room.getAvailableRooms(startTime, endTime, filters);
        
        res.status(200).json({
            success: true,
            data: availableRooms
        });
    } catch (err) {
        console.error('Error getting available rooms:', err);
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    getRooms,
    getRoomDetails,
    createRoom,
    updateRoom,
    searchRooms,
    checkRoomAvailability,
    getAvailableRooms
};