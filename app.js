if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/expressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

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
app.use(
  session({
    secret: "NCASUBElasdklms", // You should replace this with a strong and unique secret key
    resave: false,
    saveUninitialized: true, // Explicitly set the saveUninitialized option
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// app.get("/demoUser", wrapAsync(async(req,res)=>{
//   let fakeUser= new User({
//     email:"xys@gamil.com",
//     username:"faisal123",
//   });
//   let registerUser=await User.register(fakeUser,"12345");
// res.send(registerUser);
// }));

/*---------------------------------------passport---------------------------------------------*/

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user.id, done);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user); // Pass the user object, not just the user id
  } catch (err) {
    done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

/*---------------------------------------------------------------------------- */
app.use(flash());

app.use((req, res, next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  console.log("current user :", req.user);
  res.locals.currUser = req.user;
  next();
});
/*---------------------------------------routes---------------------------------------------*/
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
/*---------------------------------------root route---------------------------------------------*/
// app.get("/", (req, res) => {
//   res.send("hello im root");
// });

/*---------------------------------------ERROR HANDLING---------------------------------------------*/
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("./listings/error.ejs", { statusCode, message });
});
/*---------------------------------------port---------------------------------------------*/
app.listen(8080, () => {
  console.log("server started on port 8080");
});
