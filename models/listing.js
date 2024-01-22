const mongoose = require("mongoose");
const Schema =mongoose.Schema;

const listingSchema =new Schema ({
    title:
    {type:String,
        required:true,
    },
    description:String,
    image: { type:String,
       default:"https://images.unsplash.com/photo-1705642484141-abf2f1261257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=> v=== " "? "https://images.unsplash.com/photo-1705642484141-abf2f1261257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,

});

const listing= mongoose.model("listing",listingSchema);
module.exports=listing;