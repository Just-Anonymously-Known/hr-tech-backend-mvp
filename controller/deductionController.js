 const Deduction = require("../models/deduction.js");
const Employee = require("../models/employee.js");
const addDeduction = async(request,response)=>{
    try{
        const {employeeId ,name,amount,currency,effectiveFrom,frequency,isActive}
   = request.body;
      const company = request.user.companyId;

   if (amount<=0)
    return response.status(400).json({
    message:"Amount must be greater than 0"
   })
    const employee =await Employee.findOne({ employeeId:employeeId,company:company});
    if(!employee)
    return response.status(404).json({
    message:"Employee not found"
    })
    const newDeduction = await Deduction.create
  ({employee :employee._id,company:company,
    name,amount,currency,effectiveFrom,frequency,isActive});
 return response.status(201).json ({
        message:"Deduction added successfully!",
        data:newDeduction
        })
}catch (error){
    response.status(500).json({
        message:error.message
    })
}
}

const editDeduction = async (req,res) => {
    try{
        const {id} = req.params;
       const company = req.user.companyId;

const update = await Deduction.findOneAndUpdate(
    {
        _id: id,
        company: company
    },
    req.body,
       { $set: req.body 
     },
     { new: true, runValidators: true }
  );
        if(!update)
            return res.status (404).json({
        message:"Deduction not found"
    });
        return res.status(200).json({
            message:"Deduction updated successfully",
            data:update
        })
  }catch (error) {
        return res.status (500).json ({
            message:error.message
        })
    }
    }

    const removeDeduction = async (req,res) => {
    try{
        const {id} = req.params;
        const company = req.user.companyId;

const deleted = await Deduction.findOneAndUpdate(
    {
        _id: id,
        company: company
    },
    { $set: { isActive: false } 
     },
     { new: true, runValidators: true }
       );
            if(!deleted)
            return res.status (404).json({
        message:"Deduction not found"
            });
       
        return res.status(200).json({
       message:"Deduction deactivated!",
       data:deleted
        })
    }catch(error) {
        return res.status(500) .json({
            message:error.message
        })
    }
}
 module.exports ={addDeduction,editDeduction,removeDeduction}