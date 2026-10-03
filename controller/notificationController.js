const Notification = require("../models/Notification.js");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
      message: "Notifications gotten successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};

module.exports = {
  getNotifications,
};
