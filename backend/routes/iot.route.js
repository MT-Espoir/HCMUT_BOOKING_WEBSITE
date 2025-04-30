const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.put("/device/device-id") //trigger room's device status