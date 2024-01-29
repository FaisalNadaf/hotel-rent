
const express = require("express");
const router = express.Router();

router.get("/singup",(req,res)=>{
res.send("form");
});

module.exports=router;