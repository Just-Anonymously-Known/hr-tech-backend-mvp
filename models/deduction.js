const mongoose = require('mongoose');
const deductionSchema = new mongoose.Schema({
employee:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',required:true,unique:true},
company:{type:String, required:true},
name:{type:String,required:true},
amount: {type:Number,required:true},
currency: {type:String,required:true},
effectiveFrom:{type: Date, default:Date.now},
frequency:   {type:String,required:true,
             enum:["annually","monthly","weekly","bi-weekly","one-time"]},
isActive:     {type:Boolean,default:true}
},
             
{timestamps:true });

const Deduction = mongoose.model('Deduction', deductionSchema);
module.exports= Deduction




