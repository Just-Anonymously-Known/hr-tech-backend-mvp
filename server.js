const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ROUTES

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const deductionRoutes = require( './routes/deductionRoutes.js')
const salaryRoutes = require ('./routes/salaryRoutes.js')

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use('/deductions',deductionRoutes)
app.use('/salaries',salaryRoutes)


/*
const payrollRoutes = require('./routes/payrollRoutes');


app.use('/api/payroll', payrollRoutes);
*/

app.get('/', (req, res) => {
  res.send('Sub-Team 2 Backend (Auth & Employee Management) is running...');
});

const PORT = process.env.PORT || 5055;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});