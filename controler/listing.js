const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");

/*----------------------------------show--------------------------------------------------*/
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing does not exsisit");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

/*----------------------------------index--------------------------------------------------*/
module.exports.indexListing = async (req, res) => {
  const allListing = await listing.find({});

  res.render("listings/index.ejs", { allListing });
};
/*----------------------------------new listing--------------------------------------------------*/
module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};
/*-----------------------------create listing-------------------------------------------------------*/
module.exports.createListing = async (req, res, next) => {
  const newListing = new listing(req.body.listing);
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(req.user);
  newListing.owner = req.user;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("sucess", "new listing added sucessfull");
  res.redirect("/listings");
};
/*----------------------------edit listing--------------------------------------------------------*/
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "listing does not exsisit");
    res.redirect("/listings");
  }
  let originalImg = listing.image.url;
  originalImg.replace("/upload", "/upload/w_100");
  req.flash("sucess", "  updated sucessfull");
  res.render("listings/edit.ejs", { listing, originalImg });
};
/*------------------------------------------------------------------------------------*/
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatelist = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatelist.image = { url, filename };
    await updatelist.save();
  }
  req.flash("sucess", "updated sucessfull");
  res.redirect(`/listings/${id}`);
};
/*------------------------------------------------------------------------------------*/
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("sucess", "deleted sucessfull");
  res.redirect("/listings");
};
/*------------------------------------------------------------------------------------*/
