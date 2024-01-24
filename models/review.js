const { string, date } = require("joi");
const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const reviewSchema =new Schema ({

    comment:string,
    rating:{
        type:number,
        min:1,
        max:5,
    },
    createdAt:{
        type:date,
        default:date.now(),
    }
});

const review= mongoose.model("review",reviewSchema);
module.exports=review;