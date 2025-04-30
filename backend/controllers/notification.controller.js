const Notification = require("../models/notification.model") 

const getAllUserNotification = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_noti = Notification.findAllNotificationsByUser(user_id);
        return res.status(200).json(user_noti)
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

const getUserDetailNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await Notification.findNotificationById(notificationId);
        if (!notification || notification.user_id != req.user.id) {
            return res.status(404).send({ error: 'Notification not found' });
        }
        res.status(200).json(notification);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

const readNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await Notification.findNotificationById(notificationId);
        if (!notification || notification.user_id != req.user.id) {
            return res.status(404).send({ error: 'Notification not found' });
        }

        notification.read = true
        notification.updateNotiStatus()
        return res.status(200).send({ message: 'Notification read' });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}


const createNotificaiton = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const type = req.body.type;
        const description = req.body.description;
        const sent_at = parseInt(new Date().getTime())

        const notification = new Notification(null,user_id,type,description,sent_at,false)
        const result = notification.createNotification();
        return res.status(200).send({ message: 'Notification send!' });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

module.exports = {
    getAllUserNotification,
    getUserDetailNotification,
    readNotification,
    createNotificaiton
};