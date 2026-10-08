const express = require("express");
const router = express.Router();

const { register, login } = require("../controller/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  return res.json({
    message: "You are logged in",
    user: req.user,
  });
});

router.get("/admin-only", verifyToken, isAdmin, (req, res) => {
  return res.json({
    message: "Welcome, admin",
  });
});

module.exports = router;
