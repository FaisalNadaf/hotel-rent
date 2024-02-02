const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const review = require("../models/review.js");
const listingControler= require("../controler/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudnary.js");
const upload = multer({ storage });

/*---------------------------------------  /  ---------------------------------------------*/
router.route("/")
.get(
  wrapAsync(listingControler.indexListing)
)
.post(
  // isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingControler.createListing)
);



/*---------------------------------------new router---------------------------------------------*/
router.get("/new", 
//  isLoggedIn,
 listingControler.newListing);

/*--------------------------------------- /:id  ---------------------------------------------*/
router.route("/:id")
.get(
 
  wrapAsync(listingControler.showListing)
)
.put(

  validateListing,
  // isLoggedIn,
  wrapAsync(listingControler.updateListing)
)
.delete(
 
  // isOwner,
  wrapAsync(listingControler.destroyListing)
);

/*---------------------------------------edit listing router---------------------------------------------*/
router.get(
  "/:id/edit",
  // isLoggedIn,
  wrapAsync(listingControler.editListing)
);
/*---------------------------------------exports---------------------------------------------*/
module.exports = router;
