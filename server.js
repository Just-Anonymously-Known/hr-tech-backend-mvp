import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './config/db.js';

import employeeRoutes from './routes/employeeRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Payroll API" });
});

app.use("/api/payroll", payrollRoutes);
app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});