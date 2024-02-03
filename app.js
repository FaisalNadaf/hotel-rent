if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/expressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport=require("passport");
const LocalStartagi=require("passport-local").Strategy;
const User=require("./models/user.js");  





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
  res.locals.currentuser =req.user;
  next(); 
});

// app.get("/demoUser", wrapAsync(async(req,res)=>{
//   let fakeUser= new User({
//     email:"xys@gamil.com",
//     username:"isal123",
//   });
//   let registerUser=await User.register(fakeUser,"12345");
// res.send(registerUser);
// }));
/*---------------------------------------routes---------------------------------------------*/
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter); 
app.use("/",userRouter);  
/*---------------------------------------root route---------------------------------------------*/
// app.get("/", (req, res) => {
//   res.send("hello im root");
// });

/*---------------------------------------passport---------------------------------------------*/
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStartagi(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser( function(user, done) {
  done(null, user.id);
},User.serializeUser());
passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
    done(err, user);
  });
},User.deserializeUser()); 


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user.id);
  } catch (err) {
    done(err, null);
  }
});

      

/*---------------------------------------ERROR HANDLING---------------------------------------------*/
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});



app.use((err, req,res,next) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  res.render("./listings/error.ejs", { statusCode,message });
});
/*---------------------------------------port---------------------------------------------*/
app.listen(8080, () => {
  console.log("server started on port 8080");
});


