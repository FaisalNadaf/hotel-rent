
const ExpressError = require("./utility/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const listing = require("./models/listing.js");
const Listing = require("./models/listing.js");
const review = require("./models/review.js");



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated){
        req.session.redirecyUrl=req.originalUrl;
       req.flash("error","you are not logined");
       return res.redirect("/login");
    }
    next();
}

module.exports.redirecyUrl=(req,res,next)=>{
    if(req.session.redirecyUrl){
        res.locals.redirecyUrl=req.session.redirecyUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
      await Listing.findByIdAndUpdate(id);
      if(!req.locals.currentuser && listing.owner._id.equals(req.locals.currentuser._id)){
        req.flash("error","NO-OWNER_SHIP");
        return res.redirect(`/listings/${id}`);
      }
      next();
}

/*---------------------------------------validatelisting---------------------------------------------*/

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };

  /*---------------------------------------validatereview---------------------------------------------*/
  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };    

  module.exports.isReviewAauthor= async(req,res,next)=>{
    let { id ,reviewId} = req.params;
      await review.findByIdAndUpdate(reviewId);
      if(!req.locals.currentuser && review.author._id.equals(req.locals.currentuser._id)){
        req.flash("error","NO-OWNER_SHIP");
        return res.redirect(`/listings/${id}`);
      }
      next();
}