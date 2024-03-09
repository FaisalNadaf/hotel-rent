const mongoose =require("mongoose");
const initdata = require("./data.js");
const listing=require("../models/listing.js");

let mongo_url="mongodb://127.0.0.1:27017/wonderlust";


main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url);
}


const initdb = async ()=>{
    await listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>
        ({...obj,owner:"65ec8343114743de6d5a285e"})
    );
    await listing.insertMany(initdata.data);
    console.log("initilize new data");
};

initdb();