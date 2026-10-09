const mongoose = require('mongoose');
const salarySchema = new mongoose.Schema({
employee:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true,unique:true},
company:{type:String, required:true},
amount:      {type:Number,required:true, min:0},
currency:    {type:String,required:true},
frequency:   {type:String,required:true,
             enum:["annually","monthly","weekly","bi-weekly"]},
effectiveFrom:{type: Date,default:Date.now},
isActive:     {type:Boolean,required:true, default:true}},
{timestamps:true });

const salary = mongoose.model('Salary',salarySchema);
module.exports = salary


