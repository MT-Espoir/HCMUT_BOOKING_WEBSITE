const express = require('express');
const deviceController = require('../controllers/device.controller');

const router = express.Router();

router.get('', deviceController.getDeviceList)

module.exports = router;