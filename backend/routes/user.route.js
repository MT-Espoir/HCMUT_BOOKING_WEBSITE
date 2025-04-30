const express = require('express');
const userController = require('../controllers/user.controller');
const notiController = require('../controllers/notification.controller')

const router = express.Router();

router.get('/profile', userController.getSelfProfile);
router.put('/update-profile', userController.updateSelfProfile)
router.put('/change-password', userController.changePassword)

router.get('/notification', notiController.getAllUserNotification) //get all notification
router.get('/notification/:notificationId', notiController.getUserDetailNotification)
router.put('/notification/:notificationId', notiController.readNotification) //read notification

router.put('/room/checkin')
router.put('/room/checkout')

module.exports = router;
