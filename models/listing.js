const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const review =require("./review.js");

const listingSchema =new Schema ({
    title:String,
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
   set:(v)=> v===""?"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" :v,
    },
    price:Number,
    location:String,
    country:String,
  review:[
    {
    type:Schema.Types.ObjectId,
    ref:"review",
  },],
   owner:{
    type:Schema.Types.ObjectId,
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