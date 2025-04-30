const device_model = require('../models/device.model');

const getDeviceList = async (req, res) => {
    try {
        const devices = await device_model.getDeviceList(req.user.ID);
        res.status(302).send({devices: devices, message: "get device list successfully"});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

module.exports = {
    getDeviceList,
};