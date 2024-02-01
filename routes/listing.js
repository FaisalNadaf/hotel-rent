const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/expressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
//const { isLogedIn} = require("../middleware.js");



/*---------------------------------------validatelisting---------------------------------------------*/

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(404, errMsg);
    } else {
      next();
    }
  };

/*---------------------------------------index route---------------------------------------------*/
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListing = await listing.find({});
      res.render("listings/index.ejs", { allListing });
    })
  );
  
  /*---------------------------------------new router---------------------------------------------*/
  router.get("/new",   (req, res) => {
    res.render("listings/new.ejs");
  });
  /*---------------------------------------show router---------------------------------------------*/
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id).populate("review").populate("owner");
      if(!listing){
      req.flash("error","listing does not exsisit");
      res.redirect("/listings");
      };
      res.render("listings/show.ejs", { listing });
    })
  );
  
/*---------------------------------------create new listing router---------------------------------------------*/
router.post(
    "/",  
    validateListing,
    wrapAsync(async (req, res, next) => {
      const newListing = new listing(req.body.listing);
      console.log(req.user);
      newListing.owner=req.user;
      await newListing.save();
      req.flash("sucess","new listing added sucessfull");
      res.redirect("/listings");
    })
  );
  
  /*---------------------------------------edit listing router---------------------------------------------*/
  router.get(
    "/:id/edit",  
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error","listing does not exsisit");
        res.redirect("/listings");
        };
      req.flash("sucess","  updated sucessfull");
      res.render("listings/edit.ejs", { listing });
    })
  );
  /*---------------------------------------update listing router---------------------------------------------*/
  router.put(
    "/:id",  
    validateListing,
    wrapAsync(async (req, res) =>{
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      
      req.flash("sucess","updated sucessfull");
      res.redirect(`/listings/${id}`);
    })
  );
  
  /*---------------------------------------delete listing router---------------------------------------------*/
  router.delete(
    "/:id",  
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      
      req.flash("sucess","deleted sucessfull");
      res.redirect("/listings");
    })
  );
  
  /*---------------------------------------exports---------------------------------------------*/
  module.exports=router;