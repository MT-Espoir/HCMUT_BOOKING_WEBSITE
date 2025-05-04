const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authorizeAdmin } = require('../middleware/authorize');

const router = express.Router();

// User bookings
router.get('/user', bookingController.getUserBookings);
router.get('/:bookingId', bookingController.getBookingDetails);
router.post('/', bookingController.createBooking);
router.post('/:bookingId/cancel', bookingController.cancelBooking);
router.post('/:bookingId/change-room', bookingController.changeBookingRoom);
router.post('/:bookingId/check-in', bookingController.checkInBooking);
router.post('/:bookingId/check-out', bookingController.checkOutBooking);
router.delete('/:bookingId', bookingController.deleteBookingHistory);

module.exports = router;