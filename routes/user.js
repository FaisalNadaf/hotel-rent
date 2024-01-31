const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utility/wrapAsync");
const passport = require("passport");

router.get("/singup", (req, res) => {
  res.render("users/singup.ejs");
});

router.post(
  "/singup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new user({ username, email });
      let registerUser = await user.register(newuser, password);
      console.log(registerUser);
      req.flash("sucess", "welcome to wonder lust");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  })
);
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
  });

router.post(
  "/login",
  passport.authenticate("local",{ failureRedirect:"/login", failureFlash: true }),
  async (req, res) => {
    req.flash("sucess","welcom to wonder lust")
    res.redirect("/listings");
  }
);

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("error","you are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
