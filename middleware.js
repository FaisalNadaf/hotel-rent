const ExpressError = require("./utility/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listing = require("./models/listing.js");
const Listing = require("./models/listing.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  try {
    if (!req.isAuthenticated) {
      console.log(req.isAuthenticated());
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You are not logged in");
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.redirecyUrl = (req, res, next) => {
  if (req.session.redirecyUrl) {
    res.locals.redirecyUrl = req.session.redirecyUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Fetch the listing document from the database
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings"); // Redirect to listings page or handle accordingly
    }
    // Check if there's a logged-in user and if the user owns the listing
    console.log("current : ", res.locals.currUser);
    if (
      !res.locals.currUser &&
      listing.owner.equals(res.locals.currUser._id)
    ) {
      req.flash("error", "You don't have ownership of this listing");
      return res.redirect(`/listings/${id}`);
    }

    // If the user owns the listing, proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred");
    return res.redirect("/listings"); // Redirect to listings page or handle accordingly
  }
};

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

module.exports.isReviewAauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await review.findByIdAndUpdate(reviewId);
  console.log(review.author);
  if (
    !res.locals.currUser &&
    review.author._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "NO-OWNER_SHIP");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
