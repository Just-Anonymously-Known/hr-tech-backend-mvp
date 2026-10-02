const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const {
  getNotifications,
} = require("../controllers/notificationController.js");

router.get("/", verifyToken, getNotifications);

module.exports = router;
