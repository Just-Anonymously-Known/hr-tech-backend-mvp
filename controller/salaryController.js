
const salary=require(   "../models/salary.js");
const Employee = require("../models/employee.js");
const salaryEntry = async(request,response)=>{
    try{
        const {employeeId,amount,currency,frequency,effectiveFrom,isActive}
   =request.body
   const company = request.user.companyId;
   if (amount<=0)
    return response.status(400).json({
    message:"Amount must be greater than 0"
   })
    const employee =await Employee.findOne({employeeId:employeeId,company:company});
    if(!employee)
        return response.status(404).json({
    message:"Employee was not found"
    })
    const savedSalary = await salary.findOneAndUpdate({employee:employee._id,company:company},
        {employee:employee._id,company:company, amount,currency,frequency,effectiveFrom,isActive},
        { new:true,upsert:true})
   return response.status(201).json ({
        message:"Salary entry successful!",
        data:savedSalary

        })
}catch (error){
  return response.status(500).json({
        message:error.message
    })
}
}

const getAllSalaries = async (request,response)=>{
try{
    const  company = request.user.companyId;;
const salaries = await salary
    .find({ company: company })
    .populate("employee");
    return response.status(200).json({ 
            message:"All salaries fetched successfully",
            data:salaries
        })
}catch (error){
    return response.status(500).json({
        message:error.message
    })
    
}
}
const getSingleSalary = async  (req,res) =>{
    try{
        const {employeeId}= req.params
          const  company  = req.user.companyId;
        
        const employee = await Employee.findOne({
            employeeId: employeeId,company: company
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const single = await salary.findOne({   
        employee: employee._id,
        company: company
    })

        if (!single) {
            return res.status(404).json({
                message: "Employee salary not found"
            });
        }

        return res.status(200).json({
            message: "Salary found successfully",
            data: single
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
    


   module.exports = {salaryEntry,getAllSalaries,getSingleSalary}