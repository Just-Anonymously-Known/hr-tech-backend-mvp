 const express=require("express")
const {salaryEntry,getAllSalaries,getSingleSalary}=require('../controllers/salaryController.js')

const salaryRoute =express.Router()
salaryRoute.post( "/Enter-Salary",salaryEntry);
salaryRoute.get("/All-Salary-Entries", getAllSalaries);
salaryRoute.get("/Get-Single-Entry/:employeeId", getSingleSalary);

module.exports = salaryRoute;