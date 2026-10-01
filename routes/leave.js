const express = require("express");
const leaveRoute = express.Router();
const { applyLeave, updateLeaveStatus } = require("../controller/leave.js");
const { verifyToken, isAdmin } = require('../middleware/auth');

leaveRoute.post('/', verifyToken, applyLeave);
leaveRoute.patch('/:id/status', verifyToken, isAdmin, updateLeaveStatus);

module.exports = leaveRoute;