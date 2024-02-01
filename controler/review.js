
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");

/*---------------------------------create review---------------------------------------------------*/
module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
  console.log(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash("sucess","new review added sucessfull");
    res.redirect(`/listings/${listing._id}`);
  }
/*------------------------------------------------------------------------------------*/
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
   
    await listing.findByIdAndUpdate(id,({$pull:{review:reviewId}}));
  await review.findByIdAndDelete(reviewId);
  
  req.flash("sucess","review deleted sucessfull");
  res.redirect(`/listings/${id}`);
  }
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------*/