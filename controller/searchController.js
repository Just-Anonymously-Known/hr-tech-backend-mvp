const User = require("../models/User");

exports.searchEmployees = async (req, res) => {
  try {
    const { q } = req.query;

    // Employee role restriction
    const queryCondition = {
      role: "Employee",
    };

    if (q) {
      queryCondition.name = { $regex: q, $options: "i" };
    }

    const employees = await User.find(queryCondition)
      .select("-password -__v")
      .sort({ name: 1 });

    return res.json(employees);
  } catch (err) {
    console.error("Employee Lookup Error:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to search employee database" });
  }
};
