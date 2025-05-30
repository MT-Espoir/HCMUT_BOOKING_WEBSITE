const Booking = require('../models/booking.model');
const Room = require('../models/room.model');

/**
 * Get all bookings for the current authenticated user
 */
const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const bookings = await Booking.findBookingsByUserId(userId);
        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Get details for a specific booking
 */
const getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to access this booking' });
        }
        
        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        console.error(`Error fetching booking ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Create a new booking
 */
const createBooking = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const { roomId, title, purpose, attendeesCount, startTime, endTime, notes } = req.body;
        
        // Debug log để theo dõi dữ liệu đặt phòng
        console.log('Booking request received:', {
            roomId,
            startTime,
            endTime,
            title,
            purpose,
            attendeesCount,
            notes
        });
        
        // Basic validation
        if (!roomId || !title || !startTime || !endTime) {
            return res.status(400).send({ error: 'Missing required fields' });
        }
        
        // Calculate duration in minutes
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMinutes = Math.round((end - start) / 60000);
        
        if (durationMinutes <= 0) {
            return res.status(400).send({ error: 'End time must be after start time' });
        }
        
        // Validate room availability
        const isAvailable = await Room.checkAvailability(roomId, startTime, endTime);
        
        if (!isAvailable) {
            return res.status(400).send({ error: 'Room is not available for the selected time period' });
        }
        
        // Create new booking
        const booking = new Booking(
            null, 
            userId, 
            roomId, 
            title, 
            purpose, 
            attendeesCount, 
            startTime, 
            endTime, 
            durationMinutes, 
            'PENDING', 
            null, 
            null, 
            notes
        );
        
        const result = await booking.save();
        
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Cancel a booking
 */
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to cancel this booking' });
        }
        
        // Check if booking is in a cancellable state
        if (booking.bookingStatus !== 'PENDING' && booking.bookingStatus !== 'CONFIRMED') {
            return res.status(400).send({ error: 'Only pending or confirmed bookings can be cancelled' });
        }
        
        // Update booking status to cancelled
        booking.bookingStatus = 'CANCELLED';
        const result = await booking.update();
        
        res.status(200).json({ success: true, data: result, message: 'Booking cancelled successfully' });
    } catch (err) {
        console.error(`Error cancelling booking ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Change room for an existing booking
 */
const changeBookingRoom = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { newRoomId } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        if (!newRoomId) {
            return res.status(400).send({ error: 'New room ID is required' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to modify this booking' });
        }
        
        // Check if booking is in a modifiable state
        if (booking.bookingStatus !== 'PENDING' && booking.bookingStatus !== 'CONFIRMED') {
            return res.status(400).send({ error: 'Only pending or confirmed bookings can be modified' });
        }
        
        // Validate new room availability, loại trừ booking hiện tại khỏi việc kiểm tra chồng chéo
        const isAvailable = await Room.checkAvailability(
            newRoomId, 
            booking.startTime, 
            booking.endTime, 
            bookingId // Truyền bookingId để loại trừ trong việc kiểm tra
        );
        
        if (!isAvailable) {
            return res.status(400).send({ error: 'New room is not available for the selected time period' });
        }
        
        // Update booking with new room
        booking.roomId = newRoomId;
        const result = await booking.update();
        
        res.status(200).json({ success: true, data: result, message: 'Booking room changed successfully' });
    } catch (err) {
        console.error(`Error changing room for booking ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Check in for a booking
 */
const checkInBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to check in for this booking' });
        }
        
        // Check if booking is in a valid state for check-in
        if (booking.bookingStatus !== 'CONFIRMED' && booking.bookingStatus !== 'PENDING') {
            return res.status(400).send({ error: 'Only confirmed or pending bookings can be checked in' });
        }
        
        // Update booking status
        const updatedBooking = await booking.checkIn();
        
        res.status(200).json({ success: true, data: updatedBooking, message: 'Check-in successful' });
    } catch (err) {
        console.error(`Error checking in for booking ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Check out from a booking
 */
const checkOutBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to check out from this booking' });
        }
        
        // Check if booking is in a valid state for check-out
        if (booking.bookingStatus !== 'CHECKED_IN') {
            return res.status(400).send({ error: 'Only checked-in bookings can be checked out' });
        }
        
        // Update booking status
        const updatedBooking = await booking.checkOut();
        
        res.status(200).json({ success: true, data: updatedBooking, message: 'Check-out successful' });
    } catch (err) {
        console.error(`Error checking out from booking ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Delete booking history
 */
const deleteBookingHistory = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).send({ error: 'Unauthorized: Missing user ID' });
        }
        
        const booking = await Booking.findBookingById(bookingId);
        
        if (!booking) {
            return res.status(404).send({ error: 'Booking not found' });
        }
        
        // Check if the booking belongs to the current user or if user is admin
        if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: You do not have permission to delete this booking history' });
        }
        
        // Check if booking is in a deletable state
        if (booking.bookingStatus !== 'COMPLETED' && booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'AUTO_CANCELLED') {
            return res.status(400).send({ error: 'Only completed or cancelled bookings can be deleted' });
        }
        
        // Delete booking
        const result = await Booking.delete(bookingId);
        
        res.status(200).json({ success: true, message: 'Booking history deleted successfully' });
    } catch (err) {
        console.error(`Error deleting booking history ${req.params.bookingId}:`, err);
        res.status(500).send({ error: err.message });
    }
};

/**
 * Get all bookings for a specific user (admin access only)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} userId - User ID (optional, if provided as a function parameter)
 */
const getUserBookingsForAdmin = async (req, res, userIdParam = null) => {
    try {
        // Get user ID either from parameters or from request params
        const userId = userIdParam || req.params.userId;
        
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        
        // Verify the user has admin rights (already checked by the authorizeAdmin middleware)
        // but added here for extra safety
        if (req.user?.role.toUpperCase() !== 'ADMIN') {
            return res.status(403).send({ error: 'Forbidden: Admin access required' });
        }
        
        const bookings = await Booking.findBookingsByUserId(userId);

        // Debug log các booking được trả về từ database
        console.log(`Debug bookings for user ${userId}:`, bookings);
        
        // Đảm bảo rằng dữ liệu booking được trả về đủ các trường dữ liệu cần thiết
        const processedBookings = bookings.map(booking => {
            return {
                ...booking,
                booking_id: booking.id || booking.booking_id,
                room_id: booking.roomId || booking.room_id,
                title: booking.title,
                purpose: booking.purpose,
                start_time: booking.startTime,
                end_time: booking.endTime,
                room_name: booking.roomName,
                booking_status: booking.status
            };
        });
        
        return res.status(200).json(processedBookings);
    } catch (err) {
        console.error(`Error fetching bookings for user ${userIdParam || req.params.userId}:`, err);
        return res.status(500).send({ error: err.message });
    }
};

/**
 * Get booking by ID for admin operations
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Booking|null>} - Booking object or null if not found
 */
const getBookingForAdmin = async (bookingId) => {
    try {
        return await Booking.findBookingById(bookingId);
    } catch (err) {
        console.error(`Error fetching booking ${bookingId} for admin:`, err);
        throw err;
    }
};

module.exports = {
    getUserBookings,
    getBookingDetails,
    createBooking,
    cancelBooking,
    changeBookingRoom,
    checkInBooking,
    checkOutBooking,
    deleteBookingHistory,
    getUserBookingsForAdmin,
    getBookingForAdmin
};