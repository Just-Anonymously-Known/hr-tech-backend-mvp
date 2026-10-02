const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usermodel = require("../models/User");

exports.register = async (req, res) => {
  try {
    let nameInput = req.body.name;
    let emailInput = req.body.email;
    let passwordInput = req.body.passowrd;
    let roleInput = req.body.role;
    let checkUser = await Usermodel.findOne({ email: emailInput });

    if (checkUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    let securePassword = await bcrypt.hash(passwordInput, 10);
    let createdRecord = await Usermodel.create({
      name: nameInput,
      email: emailInput,
      password: securePassword,
      role: roleInput,
    });

    return res.status(201).json({
      id: createdRecord._id,
      name: createdRecord.name,
      role: createdRecord.role,
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    return res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    let emailInput = req.body.email;
    let passwordInput = req.body.password;

    let user = await Usermodel.findOne({ email: emailInput });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    let isMatch = await bcrypt.compare(passwordInput, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    let token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res
      .status(500)
      .json({ error: "Server error during login authentication" });
  }
};
