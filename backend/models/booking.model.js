const db = require('../config/connect_db');

class Booking {
    constructor(id, userId, roomId, title, purpose, attendeesCount, startTime, endTime, duration, bookingStatus, checkInTime, checkOutTime, notes) {
        this.id = id;
        this.userId = userId;
        this.roomId = roomId;
        this.title = title;
        this.purpose = purpose;
        this.attendeesCount = attendeesCount;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = duration;
        this.bookingStatus = bookingStatus || 'PENDING';
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.notes = notes;
    }

    /**
     * Save a new booking to the database
     * @returns {Promise<Object>} - Created booking
     */
    async save() {
        try {
            const query = `
                INSERT INTO booking (
                    user_id, room_id, title, purpose, attendees_count, 
                    start_time, end_time, duration, booking_status, 
                    check_in_time, check_out_time, notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;
            
            const [result] = await db.execute(query, [
                this.userId,
                this.roomId,
                this.title,
                this.purpose,
                this.attendeesCount,
                this.startTime,
                this.endTime,
                this.duration,
                this.bookingStatus,
                this.checkInTime,
                this.checkOutTime,
                this.notes
            ]);
            
            if (result.affectedRows === 0) {
                throw new Error('Failed to create booking');
            }
            
            return { ...this, id: result.insertId };
        } catch (error) {
            console.error('Error saving booking:', error);
            throw error;
        }
    }

    /**
     * Update an existing booking
     * @returns {Promise<Object>} - Updated booking
     */
    async update() {
        try {
            const query = `
                UPDATE booking
                SET room_id = ?, title = ?, purpose = ?, attendees_count = ?,
                    start_time = ?, end_time = ?, duration = ?, 
                    booking_status = ?, check_in_time = ?, check_out_time = ?,
                    notes = ?
                WHERE booking_id = ?;
            `;
            
            const [result] = await db.execute(query, [
                this.roomId,
                this.title,
                this.purpose,
                this.attendeesCount,
                this.startTime,
                this.endTime,
                this.duration,
                this.bookingStatus,
                this.checkInTime,
                this.checkOutTime,
                this.notes,
                this.id
            ]);
            
            if (result.affectedRows === 0) {
                throw new Error('No booking found with the given ID');
            }
            
            return this;
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    }

    /**
     * Find a booking by ID
     * @param {number} id - Booking ID
     * @returns {Promise<Booking|null>} - Booking object or null if not found
     */
    static async findBookingById(id) {
        try {
            const query = `
                SELECT b.*, r.name as room_name, r.location, r.capacity, r.room_image, r.area
                FROM booking b
                LEFT JOIN room r ON b.room_id = r.room_id
                WHERE b.booking_id = ?;
            `;
            
            const [rows] = await db.execute(query, [id]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const booking = rows[0];
            
            return new Booking(
                booking.booking_id,
                booking.user_id,
                booking.room_id,
                booking.title,
                booking.purpose,
                booking.attendees_count,
                booking.start_time,
                booking.end_time,
                booking.duration,
                booking.booking_status,
                booking.check_in_time,
                booking.check_out_time,
                booking.notes
            );
        } catch (error) {
            console.error('Error finding booking by ID:', error);
            throw error;
        }
    }

    /**
     * Find all bookings for a specific user
     * @param {number} userId - User ID
     * @returns {Promise<Array<Booking>>} - Array of booking objects
     */
    static async findBookingsByUserId(userId) {
        try {
            const query = `
                SELECT b.*, r.name as room_name, r.location, r.capacity, r.room_image, r.area
                FROM booking b
                LEFT JOIN room r ON b.room_id = r.room_id
                WHERE b.user_id = ?
                ORDER BY b.start_time DESC;
            `;
            
            const [rows] = await db.execute(query, [userId]);
            
            return rows.map(booking => ({
                id: booking.booking_id,
                roomId: booking.room_id,
                roomName: booking.room_name,
                title: booking.title,
                startTime: booking.start_time,
                endTime: booking.end_time,
                duration: booking.duration,
                status: booking.booking_status,
                location: booking.location,
                capacity: booking.capacity,
                size: booking.area,
                image: booking.room_image
            }));
        } catch (error) {
            console.error('Error finding bookings by user ID:', error);
            throw error;
        }
    }

    /**
     * Cancel a booking by changing its status to CANCELLED
     * @returns {Promise<boolean>} - True if cancelled successfully
     */
    async cancel() {
        try {
            this.bookingStatus = 'CANCELLED';
            await this.update();
            return true;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    }

    /**
     * Check in a user for a booking
     * @returns {Promise<Object>} - Updated booking
     */
    async checkIn() {
        try {
            this.bookingStatus = 'CHECKED_IN';
            this.checkInTime = new Date();
            await this.update();
            return this;
        } catch (error) {
            console.error('Error checking in booking:', error);
            throw error;
        }
    }

    /**
     * Check out a user from a booking
     * @returns {Promise<Object>} - Updated booking
     */
    async checkOut() {
        try {
            this.bookingStatus = 'COMPLETED';
            this.checkOutTime = new Date();
            await this.update();
            return this;
        } catch (error) {
            console.error('Error checking out booking:', error);
            throw error;
        }
    }

    /**
     * Delete a booking
     * @param {number} id - Booking ID
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    static async delete(id) {
        try {
            const query = `
                DELETE FROM booking
                WHERE booking_id = ?;
            `;
            
            const [result] = await db.execute(query, [id]);
            
            if (result.affectedRows === 0) {
                throw new Error('No booking found with the given ID');
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    }
}

module.exports = Booking;