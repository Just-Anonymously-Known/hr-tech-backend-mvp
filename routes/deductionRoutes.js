const express = require ("express")
const {addDeduction,editDeduction,removeDeduction}= require ('../controllers/deductionController.js')
const auth = require('../middleware/auth.js'); 
const deductionRoute =express.Router()
deductionRoute.post("/Deduction-Entry",addDeduction)
deductionRoute.patch("/Update-Deduction/:id",editDeduction)
deductionRoute.delete("/Delete-Deductions/:id",removeDeduction)

module.exports= deductionRoute