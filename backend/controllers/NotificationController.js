const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            await Notification.findByIdAndUpdate(id, { $set: { isRead: true } });
            res.json({ message: 'Notification marked as read' });
        } else {
            await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
            res.json({ message: 'All notifications marked as read' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.json({ message: 'All notifications deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
