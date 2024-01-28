const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/expressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session = require("express-session");
const flash = require('connect-flash');


/*------------------------------------------------------------------------------------*/
app.set("View engine", "ejs");
app.set("View", path.join(__dirname, "Views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

/*------------------------------------------------------------------------------------*/
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

/*---------------------------------------express-session---------------------------------------------*/
app.use(session({
  secret: 'your-secret-key', // You should replace this with a strong and unique secret key
  resave: false,
  saveUninitialized: true, // Explicitly set the saveUninitialized option
  cookie:{
     expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true,
  },
}));

app.use(flash());

app.use((req,res,next)=>{
  res.locals.sucess =req.flash("sucess");
  res.locals.error =req.flash("error");
  next();
});

/*---------------------------------------routes---------------------------------------------*/
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews); 
/*---------------------------------------root route---------------------------------------------*/
app.get("/", (req, res) => {
  res.send("hello im root");
});
/*---------------------------------------ERROR HANDLING---------------------------------------------*/
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("./listings/error.ejs", { message });
});
/*---------------------------------------port---------------------------------------------*/
app.listen(8080, () => {
  console.log("server started on port 8080");
});
