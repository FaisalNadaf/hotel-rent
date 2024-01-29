const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const userSchema =new Schema({
email:{
    type:string,
    require:true,
},
});