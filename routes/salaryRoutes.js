const auth = require("../middleware/auth.js");
 const express=require("express")
const {salaryEntry,getAllSalaries,getSingleSalary}=require('../controller/salaryController.js')

const salaryRoute =express.Router()
salaryRoute.post("/Enter-Salary",auth.verifyToken,auth.isAdmin,salaryEntry);
salaryRoute.get("/All-Salary-Entries", auth.verifyToken,auth.isAdmin, getAllSalaries);
salaryRoute.get("/Get-Single-Entry/:employeeId",  auth.verifyToken,auth.isAdmin, getSingleSalary);

module.exports = salaryRoute;
