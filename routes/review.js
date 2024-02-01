
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn} = require("../middleware.js");




  
/*---------------------------------------reviwe post route---------------------------------------------*/
router.post("/",isLoggedIn,validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
  console.log(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash("sucess","new review added sucessfull");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  /*---------------------------------------reviwe delete route---------------------------------------------*/
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
   
    await listing.findByIdAndUpdate(id,({$pull:{review:reviewId}}));
  await review.findByIdAndDelete(reviewId);
  
  req.flash("sucess","review deleted sucessfull");
  res.redirect(`/listings/${id}`);
  }));
  
  
  /*---------------------------------------exports---------------------------------------------*/
  module.exports=router;