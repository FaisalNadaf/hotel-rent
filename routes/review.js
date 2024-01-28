
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/expressError.js");
const { reviewSchema } = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");



/*---------------------------------------validatereview---------------------------------------------*/
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };    

  
/*---------------------------------------reviwe post route---------------------------------------------*/
router.post("/",validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await new review(req.body.review);
  
    listing.review.push(newReview);
  
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