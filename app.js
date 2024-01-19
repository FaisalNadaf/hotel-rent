const express=require("express");
const app=express();
const mongoose=require("mongoose");
let mongo_url="mongodb://127.0.0.1:27017/wonderlust";
const listing = require("./models/listing.js");


main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}


app.get("/",(req,res)=>{
    res.send("hello im root");
});

app.get("/listing", async(req,res)=>{



app.listen(8080,() =>{
  console.log("server started on port 8080");
});