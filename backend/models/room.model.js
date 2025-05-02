const db = require('../config/connect_db');

class Room {
    constructor(id, name, location, floor, building, capacity, area, roomType, roomImage, description, facilities, openingHours, status) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.floor = floor;
        this.building = building;
        this.capacity = capacity;
        this.area = area;
        this.roomType = roomType;
        this.roomImage = roomImage;
        this.description = description;
        this.facilities = facilities;
        this.openingHours = openingHours;
        this.status = status || 'AVAILABLE';
    }

    /**
     * Save a new room to the database
     * @returns {Promise<Object>} - Created room
     */
    async save() {
        try {
            const query = `
                INSERT INTO room (
                    name, location, floor, building, capacity, 
                    area, room_type, room_image, description, 
                    facilities, opening_hours, status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            
            const [result] = await db.execute(query, [
                this.name,
                this.location,
                this.floor,
                this.building,
                this.capacity,
                this.area,
                this.roomType,
                this.roomImage,
                this.description,
                JSON.stringify(this.facilities),
                this.openingHours,
                this.status
            ]);
            
            if (result.affectedRows === 0) {
                throw new Error('Failed to create room');
            }
            
            return { ...this, id: result.insertId };
        } catch (error) {
            console.error('Error saving room:', error);
            throw error;
        }
    }

    /**
     * Update an existing room
     * @returns {Promise<Object>} - Updated room
     */
    async update() {
        try {
            const query = `
                UPDATE room
                SET name = ?, location = ?, floor = ?, building = ?, capacity = ?,
                    area = ?, room_type = ?, room_image = ?, description = ?,
                    facilities = ?, opening_hours = ?, status = ?
                WHERE room_id = ?;
            `;
            
            const [result] = await db.execute(query, [
                this.name,
                this.location,
                this.floor,
                this.building,
                this.capacity,
                this.area,
                this.roomType,
                this.roomImage,
                this.description,
                JSON.stringify(this.facilities),
                this.openingHours,
                this.status,
                this.id
            ]);
            
            if (result.affectedRows === 0) {
                throw new Error('No room found with the given ID');
            }
            
            return this;
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    }

    /**
     * Find a room by ID
     * @param {number|string} id - Room ID
     * @returns {Promise<Room|null>} - Room object or null if not found
     */
    static async findRoomById(id) {
        try {
            const query = `
                SELECT * FROM room
                WHERE room_id = ?;
            `;
            
            const [rows] = await db.execute(query, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const room = rows[0];
            const facilities = typeof room.facilities === 'string' ? JSON.parse(room.facilities) : room.facilities;
            
            return new Room(
                room.room_id,
                room.name,
                room.location,
                room.floor,
                room.building,
                room.capacity,
                room.area,
                room.room_type,
                room.room_image,
                room.description,
                facilities,
                room.opening_hours,
                room.status
            );
        } catch (error) {
            console.error('Error finding room by ID:', error);
            throw error;
        }
    }

    /**
     * Find all rooms with optional filtering
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array<Room>>} - Array of room objects
     */
    static async findAll(filters = {}) {
        try {
            let query = `
                SELECT * FROM room
                WHERE 1=1
            `;
            
            const params = [];
            
            if (filters.capacity) {
                query += ` AND capacity >= ?`;
                params.push(filters.capacity);
            }
            
            if (filters.area) {
                query += ` AND area >= ?`;
                params.push(filters.area);
            }
            
            if (filters.status) {
                query += ` AND status = ?`;
                params.push(filters.status);
            }
            
            if (filters.building) {
                query += ` AND building = ?`;
                params.push(filters.building);
            }
            
            if (filters.floor) {
                query += ` AND floor = ?`;
                params.push(filters.floor);
            }
            
            if (filters.roomType) {
                query += ` AND room_type = ?`;
                params.push(filters.roomType);
            }
            
            // Add date filter if provided
            if (filters.date) {
                query += `
                    AND room_id NOT IN (
                        SELECT room_id FROM booking
                        WHERE DATE(start_time) = DATE(?)
                        AND booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                    )
                `;
                params.push(filters.date);
            }
            
            query += ` ORDER BY name ASC`;
            
            const [rows] = await db.execute(query, params);
            
            return rows.map(room => {
                const facilities = typeof room.facilities === 'string' ? JSON.parse(room.facilities) : room.facilities;
                
                return new Room(
                    room.room_id,
                    room.name,
                    room.location,
                    room.floor,
                    room.building,
                    room.capacity,
                    room.area,
                    room.room_type,
                    room.room_image,
                    room.description,
                    facilities,
                    room.opening_hours,
                    room.status
                );
            });
        } catch (error) {
            console.error('Error finding rooms:', error);
            throw error;
        }
    }

    /**
     * Search rooms by keyword
     * @param {string} keyword - Search keyword
     * @returns {Promise<Array<Room>>} - Array of room objects
     */
    static async searchByKeyword(keyword) {
        try {
            const query = `
                SELECT * FROM room
                WHERE name LIKE ? OR description LIKE ? OR location LIKE ?
                ORDER BY name ASC;
            `;
            
            const searchParam = `%${keyword}%`;
            const [rows] = await db.execute(query, [searchParam, searchParam, searchParam]);
            
            return rows.map(room => {
                const facilities = typeof room.facilities === 'string' ? JSON.parse(room.facilities) : room.facilities;
                
                return new Room(
                    room.room_id,
                    room.name,
                    room.location,
                    room.floor,
                    room.building,
                    room.capacity,
                    room.area,
                    room.room_type,
                    room.room_image,
                    room.description,
                    facilities,
                    room.opening_hours,
                    room.status
                );
            });
        } catch (error) {
            console.error('Error searching rooms:', error);
            throw error;
        }
    }

    /**
     * Check if a room is available for a specific time period
     * @param {number|string} roomId - Room ID
     * @param {string} startTime - Start date and time
     * @param {string} endTime - End date and time
     * @returns {Promise<boolean>} - True if room is available, false otherwise
     */
    static async checkAvailability(roomId, startTime, endTime) {
        try {
            // First check if room exists and is available
            const roomQuery = `
                SELECT * FROM room
                WHERE room_id = ? AND status = 'AVAILABLE';
            `;
            
            const [roomRows] = await db.execute(roomQuery, [roomId]);
            
            if (roomRows.length === 0) {
                return false; // Room doesn't exist or is not available
            }
            
            // Check if there are any overlapping bookings
            const bookingQuery = `
                SELECT * FROM booking
                WHERE room_id = ?
                  AND booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                  AND (
                      (start_time <= ? AND end_time > ?) OR
                      (start_time < ? AND end_time >= ?) OR
                      (start_time >= ? AND end_time <= ?)
                  );
            `;
            
            const [bookingRows] = await db.execute(bookingQuery, [
                roomId,
                endTime, startTime,    // Case 1: Existing booking starts before and ends during/after requested period
                startTime, endTime,    // Case 2: Existing booking starts during and ends after requested period
                startTime, endTime     // Case 3: Existing booking is fully contained within requested period
            ]);
            
            // If there are no overlapping bookings, the room is available
            return bookingRows.length === 0;
        } catch (error) {
            console.error('Error checking room availability:', error);
            throw error;
        }
    }

    /**
     * Get available rooms for a specific time period
     * @param {string} startTime - Start date and time
     * @param {string} endTime - End date and time
     * @param {Object} filters - Additional filters
     * @returns {Promise<Array<Room>>} - Array of available rooms
     */
    static async getAvailableRooms(startTime, endTime, filters = {}) {
        try {
            // Start with general filters
            let query = `
                SELECT r.* FROM room r
                WHERE r.status = 'AVAILABLE'
            `;
            
            const params = [];
            
            // Add capacity filter if provided
            if (filters.capacity) {
                query += ` AND r.capacity >= ?`;
                params.push(filters.capacity);
            }
            
            // Add area filter if provided
            if (filters.area) {
                query += ` AND r.area >= ?`;
                params.push(filters.area);
            }
            
            // Add building filter if provided
            if (filters.building) {
                query += ` AND r.building = ?`;
                params.push(filters.building);
            }
            
            // Add floor filter if provided
            if (filters.floor) {
                query += ` AND r.floor = ?`;
                params.push(filters.floor);
            }
            
            // Add room type filter if provided
            if (filters.roomType) {
                query += ` AND r.room_type = ?`;
                params.push(filters.roomType);
            }
            
            // Exclude rooms with overlapping bookings
            query += `
                AND NOT EXISTS (
                    SELECT 1 FROM booking b
                    WHERE b.room_id = r.room_id
                      AND b.booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                      AND (
                          (b.start_time <= ? AND b.end_time > ?) OR
                          (b.start_time < ? AND b.end_time >= ?) OR
                          (b.start_time >= ? AND b.end_time <= ?)
                      )
                )
                ORDER BY r.name ASC;
            `;
            
            params.push(
                endTime, startTime,    // Case 1: Existing booking starts before and ends during/after requested period
                startTime, endTime,    // Case 2: Existing booking starts during and ends after requested period
                startTime, endTime     // Case 3: Existing booking is fully contained within requested period
            );
            
            const [rows] = await db.execute(query, params);
            
            return rows.map(room => {
                const facilities = typeof room.facilities === 'string' ? JSON.parse(room.facilities) : room.facilities;
                
                return new Room(
                    room.room_id,
                    room.name,
                    room.location,
                    room.floor,
                    room.building,
                    room.capacity,
                    room.area,
                    room.room_type,
                    room.room_image,
                    room.description,
                    facilities,
                    room.opening_hours,
                    room.status
                );
            });
        } catch (error) {
            console.error('Error getting available rooms:', error);
            throw error;
        }
    }
}

module.exports = Room;