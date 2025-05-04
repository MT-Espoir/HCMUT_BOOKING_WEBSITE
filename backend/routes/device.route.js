const express = require('express');
const deviceController = require('../controllers/device.controller');

const router = express.Router();

router.get('', deviceController.getDeviceList);
// Thêm route để lấy thiết bị theo phòng
router.get('/room/:roomId', deviceController.getDevicesByRoom);

module.exports = router;