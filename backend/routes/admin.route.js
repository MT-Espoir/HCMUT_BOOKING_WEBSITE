const express = require('express');
const userController = require('../controllers/user.controller');
const roomController = require('../controllers/room.controller')
const bookingController = require('../controllers/booking.controller')
const notificationController = require('../controllers/notification.controller')
const { authorizeAdmin } = require('../middleware/authorize');

const router = express.Router();

// Add the authorizeAdmin middleware to protect all admin routes
router.use(authorizeAdmin);

// Fix function names to match those in the room controller
router.get('/room', roomController.getRooms) //get all room information
router.post('/room', roomController.createRoom) //create new room
router.get('/room/:roomId', roomController.getRoomDetails) //get room detail
router.put('/room/:roomId', roomController.updateRoom) //update room detail
router.delete('/room/:roomId', (req, res) => {
  // Placeholder for delete room functionality
  res.status(200).send({ message: 'Delete room functionality to be implemented' });
}) //delete room

// Add placeholder controller functions for routes that don't have handlers yet
// Note: These should be implemented properly later
const deviceController = {
  getAllDevices: (req, res) => {
    res.status(200).send({ message: 'Get all devices functionality to be implemented' });
  },
  addDevice: (req, res) => {
    res.status(200).send({ message: 'Add device functionality to be implemented' });
  },
  getDeviceDetails: (req, res) => {
    res.status(200).send({ message: 'Get device details functionality to be implemented' });
  },
  updateDevice: (req, res) => {
    res.status(200).send({ message: 'Update device functionality to be implemented' });
  },
  deleteDevice: (req, res) => {
    res.status(200).send({ message: 'Delete device functionality to be implemented' });
  },
  getRoomUsage: (req, res) => {
    res.status(200).send({ message: 'Get room usage functionality to be implemented' });
  }
};

const reportController = {
  getReport: (req, res) => {
    res.status(200).send({ message: 'Get report functionality to be implemented' });
  },
  exportReport: (req, res) => {
    res.status(200).send({ message: 'Export report functionality to be implemented' });
  }
};

// Implement the missing routes
router.get("/room/:roomId/device", deviceController.getAllDevices) //get all device of the room
router.post("/room/:roomId/device", deviceController.addDevice) //add device to room
router.get("/room/:roomId/device/:deviceId", deviceController.getDeviceDetails) //get device of the room
router.put("/room/:roomId/device/:deviceId", deviceController.updateDevice) //update information for device
router.delete("/room/:roomId/device/:deviceId", deviceController.deleteDevice) //delete device from room

router.get("/room/:roomId/usage", deviceController.getRoomUsage) //get room usage status

router.post('/notification/send', notificationController.createNotificaiton) //send notification for user

router.get('/user', userController.getUsersAndTheirActiveStatus) //get list of all user and their active status
router.get('/user/:userId', userController.getUserProfile) //get user detail
router.put('/user/:userId', userController.updateUserStatus) //update user status

// Fix function names to match those in the booking controller
router.get("/booking", (req, res) => {
  // This will be a wrapper around getUserBookings that gets all bookings for admin
  res.status(200).send({ message: 'Get all bookings functionality to be implemented' });
}) //get all booking request
router.get("/booking/:bookingId", bookingController.getBookingDetails) //view booking detail
router.put("/booking/:bookingId", (req, res) => {
  // Admin function to approve or reject booking
  const { bookingId } = req.params;
  const { status } = req.body;
  
  res.status(200).send({ 
    message: 'Update booking status functionality to be implemented',
    bookingId,
    newStatus: status
  });
}) //approve or reject booking status

router.get("/report", reportController.getReport) //get usage report
router.get("/report/export", reportController.exportReport) //export report as pdf

module.exports = router;
