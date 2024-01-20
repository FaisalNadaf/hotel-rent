const express=require("express");
const app=express();
const mongoose=require("mongoose");
let mongo_url="mongodb://127.0.0.1:27017/wonderlust";
const listing = require("./models/listing.js");
const path = require("path");
const Listing = require("./models/listing.js");
app.set("View engine","ejs");
app.set("Views",path.join(__dirname,"Views"));
app.use(express.urlencoded({extended:true}));


/*---------------------------------------main---------------------------------------------*/
main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}


/*---------------------------------------root route---------------------------------------------*/
app.get("/",(req,res)=>{
    res.send("hello im root");
});

/*---------------------------------------index route---------------------------------------------*/
app.get("/listing",async(req,res)=>{
    const allListing= await listing.find({});
    res.render("listings/index.ejs",{allListing});

});

/*---------------------------------------show route---------------------------------------------*/
app.get("/listing/:id", async(req,res)=>{
    let {id}=req.params;
    const listing =await listing.findById(id);
    res.render("listings/show.ejs",{listing});
});


/*---------------------------------------port---------------------------------------------*/
app.listen(8080,() =>{
  console.log("server started on port 8080");
});