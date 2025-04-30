const express = require('express');
const userController = require('../controllers/user.controller');
const roomController = require('../controllers/room.controller');
const bookingController = require('../controllers/booking.controller');
const { authorizeStudent } = require('../middleware/authorize');

const router = express.Router();

// Add the authorizeStudent middleware to protect all student routes
router.use(authorizeStudent);

// Update room controller function names to match the actual exported functions
router.get('/room', roomController.getRooms) //get all room
router.get('/room/:roomId', roomController.getRoomDetails) //get room detail
router.get('/room/:roomId/busy', (req, res) => {
  // Implement a function that wraps the checkRoomAvailability function
  const { roomId } = req.params;
  const { date } = req.query;
  
  // Return schedule for the day
  res.status(200).send({ 
    message: 'Room booking schedule functionality to be implemented',
    roomId,
    date: date || new Date().toISOString().slice(0, 10) // Default to today
  });
}) //get room free time of a specific day

// Fix booking controller function names
router.get('/booking', bookingController.getUserBookings) //get all booking of a student
router.post('/booking', bookingController.createBooking) // create booking request 
router.get('/booking/:bookingId', bookingController.getBookingDetails) //get booking room detail
router.put('/booking/:bookingId', bookingController.changeBookingRoom) //update booking room
router.delete('/booking/:bookingId', bookingController.cancelBooking) //delete booking room

module.exports = router;