
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/expressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const review = require("../models/review.js");


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
router.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await new review(req.body.review);
  
    listing.review.push(newReview);
  
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }));
  
  /*---------------------------------------reviwe delete route---------------------------------------------*/
  router.delete("/listins/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,({$pull:{review:reviewId}}));
  await review.findByIdAndDelete("reviewId");
  res.redirect(`/listings/${id}`);
  }));
  
  
  /*---------------------------------------exports---------------------------------------------*/
  module.exports=router;