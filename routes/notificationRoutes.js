const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const { getNotifications } = require("../controller/notificationController.js");

router.get("/", verifyToken, getNotifications);

module.exports = router;
