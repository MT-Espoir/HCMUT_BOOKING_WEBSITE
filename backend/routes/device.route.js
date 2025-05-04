const express = require('express');
const deviceController = require('../controllers/device.controller');
const { authorizeAdmin } = require('../middleware/authorize');

const router = express.Router();

router.get('', deviceController.getDeviceList);
// Thêm route để lấy thiết bị theo phòng
router.get('/room/:roomId', deviceController.getDevicesByRoom);
// Thêm route để cập nhật trạng thái thiết bị và phòng liên quan
router.put('/:deviceId', authorizeAdmin, deviceController.updateDeviceStatus);

module.exports = router;