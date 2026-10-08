const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { searchEmployees } = require("../controller/searchController");

router.get("/employees", verifyToken, searchEmployees);

module.exports = router;
