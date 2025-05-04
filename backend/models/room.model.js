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
            
            // Cải thiện date filter để chỉ lọc theo chồng chéo thời gian, không lọc theo ngày
            if (filters.date && filters.startTime && filters.endTime) {
                // Chuẩn hóa datetime
                const fullStartTime = `${filters.date}T${filters.startTime}`;
                const fullEndTime = `${filters.date}T${filters.endTime}`;
                
                query += `
                    AND room_id NOT IN (
                        SELECT room_id FROM booking
                        WHERE booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                        AND (
                            (start_time < ? AND end_time > ?) OR
                            (start_time < ? AND end_time > ?) OR
                            (start_time >= ? AND end_time <= ?)
                        )
                    )
                `;
                params.push(
                    fullEndTime, fullStartTime,      // Kiểm tra booking kết thúc sau khi thời gian mới bắt đầu
                    fullStartTime, fullStartTime,    // Kiểm tra booking bắt đầu trước khi thời gian mới kết thúc
                    fullStartTime, fullEndTime       // Kiểm tra booking nằm hoàn toàn trong khoảng thời gian mới
                );
            } 
            // Nếu chỉ có date mà không có startTime, endTime (backwards compatibility)
            else if (filters.date) {
                console.log('Using legacy date filter without time range');
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
     * Check if a time period is within room opening hours
     * @param {string|Array} openingHours - Opening hours in JSON format or parsed array
     * @param {string} startTime - Start time to check
     * @param {string} endTime - End time to check
     * @returns {boolean} - True if the time period is within opening hours
     */
    static isWithinOpeningHours(openingHours, startTime, endTime) {
        try {
            // Kiểm tra tham số đầu vào
            if (!openingHours || !startTime || !endTime) {
                console.log('Missing parameters in isWithinOpeningHours, defaulting to available');
                return true;
            }

            // Parse opening hours if needed
            const timeRanges = typeof openingHours === 'string' ? 
                JSON.parse(openingHours) : openingHours;
            
            // Xử lý chuỗi thời gian
            // Trích xuất giờ từ tham số đầu vào, hỗ trợ nhiều định dạng thời gian
            let requestStartHour = 0;
            let requestStartMinute = 0;
            let requestEndHour = 0;
            let requestEndMinute = 0;
            
            // Định dạng hàm để trích xuất thời gian từ các dạng chuỗi khác nhau
            const extractTimeComponents = (timeString) => {
                if (typeof timeString !== 'string') {
                    console.error('Invalid time string format:', timeString);
                    return { hour: 0, minute: 0 };
                }
                
                // Trường hợp ISO string: "2025-05-03T17:00:00" hoặc "2025-05-03 17:00:00"
                const isoPattern = /(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;
                const isoMatch = timeString.match(isoPattern);
                
                if (isoMatch) {
                    return { 
                        hour: parseInt(isoMatch[4], 10), 
                        minute: parseInt(isoMatch[5], 10) 
                    };
                }
                
                // Trường hợp chỉ có giờ: "17:00" hoặc "17:00:00"
                const timePattern = /(\d{1,2}):(\d{2})(?::(\d{2}))?/;
                const timeMatch = timeString.match(timePattern);
                
                if (timeMatch) {
                    return { 
                        hour: parseInt(timeMatch[1], 10), 
                        minute: parseInt(timeMatch[2], 10) 
                    };
                }
                
                console.error('Unrecognized time format:', timeString);
                return { hour: 0, minute: 0 };
            };
            
            // Trích xuất giờ và phút từ chuỗi thời gian
            const startTimeComponents = extractTimeComponents(startTime);
            const endTimeComponents = extractTimeComponents(endTime);
            
            requestStartHour = startTimeComponents.hour;
            requestStartMinute = startTimeComponents.minute;
            requestEndHour = endTimeComponents.hour;
            requestEndMinute = endTimeComponents.minute;
            
            console.log(`Extracted time for availability check: ${requestStartHour}:${requestStartMinute} - ${requestEndHour}:${requestEndMinute}`);
            
            // Kiểm tra định dạng thời gian mở cửa cũ (string với dấu -)
            if (typeof openingHours === 'string' && openingHours.includes('-')) {
                const [rangeStart, rangeEnd] = openingHours.split('-');
                return this.isTimeInRange(
                    `${requestStartHour}:${requestStartMinute}`,
                    `${requestEndHour}:${requestEndMinute}`,
                    rangeStart,
                    rangeEnd
                );
            }
            
            // Kiểm tra các khung giờ hoạt động
            if (Array.isArray(timeRanges)) {
                for (const range of timeRanges) {
                    if (!range.start || !range.end) {
                        console.log('Invalid range format:', range);
                        continue;
                    }
                    
                    const [rangeStartHour, rangeStartMinute] = range.start.split(':').map(Number);
                    const [rangeEndHour, rangeEndMinute] = range.end.split(':').map(Number);
                    
                    console.log(`Comparing with opening hours: ${rangeStartHour}:${rangeStartMinute} - ${rangeEndHour}:${rangeEndMinute}`);
                    
                    // Kiểm tra thời gian bắt đầu
                    const startInRange = (
                        (requestStartHour > rangeStartHour) || 
                        (requestStartHour === rangeStartHour && requestStartMinute >= rangeStartMinute)
                    ) && (
                        (requestStartHour < rangeEndHour) || 
                        (requestStartHour === rangeEndHour && requestStartMinute <= rangeEndMinute)
                    );
                    
                    // Kiểm tra thời gian kết thúc
                    const endInRange = (
                        (requestEndHour > rangeStartHour) || 
                        (requestEndHour === rangeStartHour && requestEndMinute >= rangeStartMinute)
                    ) && (
                        (requestEndHour < rangeEndHour) || 
                        (requestEndHour === rangeEndHour && requestEndMinute <= rangeEndMinute)
                    );
                    
                    // Log chi tiết hơn nếu là phòng B1-101
                    if (typeof room === 'object' && room && room.name && room.name.includes('B1-101')) {
                        console.log(`B1-101 Time check details:
                        - Request time: ${requestStartHour}:${requestStartMinute} - ${requestEndHour}:${requestEndMinute}
                        - Opening hours: ${rangeStartHour}:${rangeStartMinute} - ${rangeEndHour}:${rangeEndMinute}
                        - Start in range: ${startInRange}
                        - End in range: ${endInRange}
                        - Conditions:
                            start > rangeStart: ${requestStartHour > rangeStartHour}
                            start = rangeStart & minutes in range: ${requestStartHour === rangeStartHour && requestStartMinute >= rangeStartMinute}
                            start < rangeEnd: ${requestStartHour < rangeEndHour}
                            start = rangeEnd & minutes in range: ${requestStartHour === rangeEndHour && requestStartMinute <= rangeEndMinute}
                            end > rangeStart: ${requestEndHour > rangeStartHour}
                            end = rangeStart & minutes in range: ${requestEndHour === rangeStartHour && requestEndMinute >= rangeStartMinute}
                            end < rangeEnd: ${requestEndHour < rangeEndHour}
                            end = rangeEnd & minutes in range: ${requestEndHour === rangeEndHour && requestEndMinute <= rangeEndMinute}`);
                    }
                    
                    console.log(`Start time in range: ${startInRange}, End time in range: ${endInRange}`);
                    
                    // Cả thời gian bắt đầu và kết thúc phải nằm trong cùng một khoảng
                    if (startInRange && endInRange) {
                        console.log('Time range is within opening hours!');
                        return true;
                    }
                }
                
                console.log('Time range is NOT within opening hours!');
                return false;
            }
            
            // Nếu không tìm thấy định dạng giờ mở cửa hợp lệ, mặc định cho phòng khả dụng
            console.log('Unknown opening hours format, defaulting to available');
            return true;
        } catch (error) {
            console.error('Error in isWithinOpeningHours:', error);
            // Trong trường hợp có lỗi, mặc định cho phòng khả dụng
            return true;
        }
    }

    /**
     * Helper function to check if a time is within a range
     */
    static isTimeInRange(startTime, endTime, rangeStart, rangeEnd) {
        try {
            // Kiểm tra tham số
            if (!startTime || !endTime || !rangeStart || !rangeEnd) {
                console.log('Missing parameters in isTimeInRange, defaulting to available');
                return true;
            }

            // Extract just the time portion if we have full datetime strings
            const extractTimeOnly = (dateTimeStr) => {
                try {
                    if (typeof dateTimeStr !== 'string') {
                        console.error('Invalid datetime string:', dateTimeStr);
                        return '00:00'; // Fallback
                    }
                    
                    if (dateTimeStr.includes('T')) {
                        const date = new Date(dateTimeStr);
                        if (isNaN(date.getTime())) {
                            console.error('Invalid date:', dateTimeStr);
                            return '00:00'; // Fallback
                        }
                        
                        // Sử dụng giờ địa phương thay vì UTC+7 để tránh phức tạp
                        const hours = date.getHours();
                        const minutes = date.getMinutes();
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    }
                    return dateTimeStr;
                } catch (e) {
                    console.error('Error in extractTimeOnly:', e);
                    return '00:00'; // Fallback
                }
            };
            
            const start = extractTimeOnly(startTime);
            const end = extractTimeOnly(endTime);
            
            // Chuẩn hóa các chuỗi thời gian
            const normalizeTime = (timeStr) => {
                if (!timeStr || typeof timeStr !== 'string') return '00:00';
                
                // Handle format without ':' like '700' or '7' -> '07:00'
                if (!timeStr.includes(':')) {
                    if (timeStr.length <= 2) {
                        return `${timeStr.padStart(2, '0')}:00`;
                    } else {
                        const hour = timeStr.slice(0, -2).padStart(2, '0');
                        const minute = timeStr.slice(-2).padStart(2, '0');
                        return `${hour}:${minute}`;
                    }
                }
                
                // Handle format with ':' like '7:00' -> '07:00'
                const parts = timeStr.split(':');
                if (parts.length === 2) {
                    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
                }
                
                return timeStr;
            };
            
            const normalizedStart = normalizeTime(start);
            const normalizedEnd = normalizeTime(end);
            const normalizedRangeStart = normalizeTime(rangeStart);
            const normalizedRangeEnd = normalizeTime(rangeEnd);
            
            console.log(`Comparing time range: ${normalizedStart} - ${normalizedEnd} with opening hours: ${normalizedRangeStart} - ${normalizedRangeEnd}`);
            
            // Nếu thời gian bắt đầu và kết thúc nằm trong khoảng giờ mở cửa
            const isWithinRange = normalizedStart >= normalizedRangeStart && normalizedEnd <= normalizedRangeEnd;
            
            console.log(`Time is ${isWithinRange ? 'within' : 'NOT within'} range`);
            return isWithinRange;
        } catch (error) {
            console.error('Error in isTimeInRange:', error);
            return true; // Nếu có lỗi, mặc định là phòng khả dụng
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
            // First check if the requested time is in the past
            const now = new Date();
            const requestStartTime = new Date(startTime);
            
            if (requestStartTime < now) {
                console.log(`Room ${roomId} is not available - requested time (${startTime}) is in the past`);
                return false; // Cannot book for a time that has already passed
            }
            
            // First check if room exists and is available
            const roomQuery = `
                SELECT * FROM room
                WHERE room_id = ? AND status = 'AVAILABLE';
            `;
            
            const [roomRows] = await db.execute(roomQuery, [roomId]);
            
            if (roomRows.length === 0) {
                console.log(`Room ${roomId} does not exist or is not available`);
                return false; // Room doesn't exist or is not available
            }
            
            const room = roomRows[0];
            
            // Debug log
            console.log(`Checking availability for room ${roomId}:`, {
                requestedStartTime: startTime,
                requestedEndTime: endTime,
                roomStatus: room.status
            });
            
            // Check if the requested time falls within opening hours
            const isWithinHours = this.isWithinOpeningHours(room.opening_hours, startTime, endTime);
            if (!isWithinHours) {
                console.log(`Room ${roomId} is not available - outside opening hours`);
                return false; // Not within opening hours
            }
            
            // Check if there are any overlapping bookings
            // Chỉ kiểm tra chồng chéo thời gian một cách chính xác
            const bookingQuery = `
                SELECT * FROM booking
                WHERE room_id = ?
                  AND booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                  AND (
                      (start_time < ? AND end_time > ?) OR  /* Booking kết thúc sau khi yêu cầu mới bắt đầu */
                      (start_time < ? AND end_time > ?) OR  /* Booking bắt đầu trước khi yêu cầu mới kết thúc */
                      (start_time >= ? AND end_time <= ?)   /* Booking nằm hoàn toàn trong khoảng thời gian yêu cầu mới */
                  );
            `;
            
            const [bookingRows] = await db.execute(bookingQuery, [
                roomId,
                startTime, startTime,  /* Kiểm tra trường hợp 1: booking hiện tại kết thúc sau khi booking mới bắt đầu */
                endTime, endTime,      /* Kiểm tra trường hợp 2: booking hiện tại bắt đầu trước khi booking mới kết thúc */
                startTime, endTime     /* Kiểm tra trường hợp 3: booking hiện tại hoàn toàn nằm trong booking mới */
            ]);
            
            if (bookingRows.length > 0) {
                console.log(`Room ${roomId} is not available - overlapping bookings found:`, 
                    bookingRows.map(b => `${new Date(b.start_time).toLocaleString()} - ${new Date(b.end_time).toLocaleString()}`));
                return false; // Overlapping bookings found
            }
            
            // If there are no overlapping bookings, the room is available
            console.log(`Room ${roomId} is available for the requested time`);
            return true;
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
            // Kiểm tra nếu thời gian đã qua
            const now = new Date();
            const requestStartTime = new Date(startTime);
            
            // Nếu thời gian bắt đầu đã qua, trả về mảng rỗng
            if (requestStartTime < now) {
                console.log(`Requested start time (${startTime}) is in the past. No rooms available.`);
                return [];
            }
            
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
            
            // Cải thiện cách kiểm tra chồng chéo booking - kiểm tra đúng sự chồng chéo thời gian
            query += `
                AND NOT EXISTS (
                    SELECT 1 FROM booking b
                    WHERE b.room_id = r.room_id
                      AND b.booking_status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN')
                      AND (
                          (b.start_time < ? AND b.end_time > ?) OR  /* Booking kết thúc sau khi thời gian mới bắt đầu */
                          (b.start_time < ? AND b.end_time > ?) OR  /* Booking bắt đầu trước khi thời gian mới kết thúc */
                          (b.start_time >= ? AND b.end_time <= ?)   /* Booking nằm hoàn toàn trong khoảng thời gian mới */
                      )
                )
                ORDER BY r.name ASC;
            `;
            
            params.push(
                startTime, startTime,  /* Kiểm tra trường hợp 1 */
                endTime, endTime,      /* Kiểm tra trường hợp 2 */
                startTime, endTime     /* Kiểm tra trường hợp 3 */
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