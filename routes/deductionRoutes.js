const auth = require("../middleware/auth.js");
const express = require ("express")
const {addDeduction,editDeduction,removeDeduction}= require ('../controller/deductionController.js')

const deductionRoute =express.Router()
deductionRoute.post("/Deduction-Entry", auth.verifyToken,auth.isAdmin,addDeduction)
deductionRoute.patch("/Update-Deduction/:id", auth.verifyToken,auth.isAdmin,editDeduction)
deductionRoute.delete("/Delete-Deductions/:id", auth.verifyToken,auth.isAdmin,removeDeduction)

module.exports= deductionRoute