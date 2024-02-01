const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync.js");

const { isLoggedIn } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

const { isOwner } = require("../middleware.js");
const review = require("../models/review.js");
const listingControler= require("../controler/listing.js");

/*---------------------------------------index route---------------------------------------------*/
router.get(
  "/",
  wrapAsync(listingControler.indexListing)
);

/*---------------------------------------new router---------------------------------------------*/
router.get("/new", isLoggedIn,listingControler.newListing);
/*---------------------------------------show router---------------------------------------------*/
router.get(
  "/:id",
  wrapAsync(listingControler.showListing)
);

/*---------------------------------------create new listing router---------------------------------------------*/
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingControler.createListing)
);

/*---------------------------------------edit listing router---------------------------------------------*/
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingControler.editListing)
);
/*---------------------------------------update listing router---------------------------------------------*/
router.put(
  "/:id",
  validateListing,
  isLoggedIn,
  wrapAsync(listingControler.updateListing)
);

/*---------------------------------------delete listing router---------------------------------------------*/
router.delete(
  "/:id",
  isOwner,
  wrapAsync(listingControler.destroyListing)
);

/*---------------------------------------exports---------------------------------------------*/
module.exports = router;
