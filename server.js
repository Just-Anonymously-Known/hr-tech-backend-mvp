const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable cors config from env
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", require("./routes/payrollRoutes"));   // new

app.get("/", (req, res) => {                                  // main's
  res.send("HR Backend is running...");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
  });

/*
const salaryRoutes = require('./routes/salaryRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

app.use('/api/salaries', salaryRoutes);
app.use('/api/payroll', payrollRoutes);
*/
