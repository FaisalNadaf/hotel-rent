const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const review =require("./review.js");
const { string } = require("joi");

const listingSchema =new Schema ({
    title:String,
    description:String,
    image:{
url:String,
filename:String,
    },
    price:Number,
    location:String,
    country:String,
  review:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"review",
  },],
   owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
   
});


listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
 await review.deleteMany({_id:{$in:listing.reviews}});
}
});


const listing= mongoose.model("listing",listingSchema);
module.exports=listing;