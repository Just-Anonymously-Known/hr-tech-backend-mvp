const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/auth");
const { searchEmployees } = require("../controllers/searchController");

router.get("/employees", verifyToken, searchEmployees);

module.exports = router;
