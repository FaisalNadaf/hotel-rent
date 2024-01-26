const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
const { log } = require("console");

app.set("View engine", "ejs");
app.set("View", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

let mongo_url = "mongodb://127.0.0.1:27017/wonderlust";
/*---------------------------------------main---------------------------------------------*/
main()
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

/*---------------------------------------validatelisting---------------------------------------------*/
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

/*---------------------------------------root route---------------------------------------------*/
app.get("/", (req, res) => {
  res.send("hello im root");
});

/*---------------------------------------index route---------------------------------------------*/
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await listing.find({});
    res.render("listings/index.ejs", { allListing });
  })
);

/*---------------------------------------new route---------------------------------------------*/
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
/*---------------------------------------show route---------------------------------------------*/
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs", { listing });
  })
);

/*---------------------------------------create new listing route---------------------------------------------*/
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  })
);

/*---------------------------------------edit listing route---------------------------------------------*/
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

/*---------------------------------------update listing route---------------------------------------------*/
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

/*---------------------------------------delete listing route---------------------------------------------*/
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);
/*---------------------------------------reviwe post route---------------------------------------------*/
app.post("/listings/:id/reviews",validateReview,wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = await new review(req.body.review);

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

/*---------------------------------------ERROR HANDLING---------------------------------------------*/
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("./listings/error.ejs", { message });
});

/*---------------------------------------port---------------------------------------------*/
app.listen(8080, () => {
  console.log("server started on port 8080");
});
