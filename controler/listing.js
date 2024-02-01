const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");

/*----------------------------------show--------------------------------------------------*/
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
   const listing = await Listing.findById(id)
  .populate({ path: 'review', populate: { path: 'author' } })
  .populate('owner');
    if (!listing) {
      req.flash("error", "listing does not exsisit");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }

/*----------------------------------index--------------------------------------------------*/
module.exports.indexListing=async (req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
  }
/*----------------------------------new listing--------------------------------------------------*/
module.exports.newListing= (req, res) => {
    res.render("listings/new.ejs");
  }
/*-----------------------------create listing-------------------------------------------------------*/
module.exports.createListing=async (req, res, next) => {
    const newListing = new listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user;
    await newListing.save();
    req.flash("sucess", "new listing added sucessfull");
    res.redirect("/listings");
  }
/*----------------------------edit listing--------------------------------------------------------*/
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing does not exsisit");
      res.redirect("/listings");
    }
    req.flash("sucess", "  updated sucessfull");
    res.render("listings/edit.ejs", { listing });
  }
/*------------------------------------------------------------------------------------*/
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("sucess", "updated sucessfull");
    res.redirect(`/listings/${id}`);
  }
/*------------------------------------------------------------------------------------*/
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("sucess", "deleted sucessfull");
    res.redirect("/listings");
  }
/*------------------------------------------------------------------------------------*/
