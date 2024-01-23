const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const listingSchema =new Schema ({
    title:String,
    description:String,
    image:{
        type:String,
        
   set:(v)=> v===" "?"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" :v,
    },
    price:Number,
    location:String,
    country:String,

});

const listing= mongoose.model("listing",listingSchema);
module.exports=listing;