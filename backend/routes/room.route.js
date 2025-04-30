const express = require('express');
const roomController = require('../controllers/room.controller');
const { authorizeAdmin } = require('../middleware/authorize');

const router = express.Router();

// Public routes (available to authenticated users)
router.get('/', roomController.getRooms);
router.get('/search', roomController.searchRooms);
router.get('/:roomId', roomController.getRoomDetails);
router.get('/:roomId/availability', roomController.checkRoomAvailability);

// Admin-only routes
router.post('/', authorizeAdmin, roomController.createRoom);
router.put('/:roomId', authorizeAdmin, roomController.updateRoom);

module.exports = router;