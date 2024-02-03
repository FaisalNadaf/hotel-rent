const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync");
const { redirecyUrl, isLoggedIn } = require("../middleware");
const userControler = require("../controler/user");
const { route } = require("./listing");
const passport = require("passport");

/*----------------------------------- /signup -------------------------------------------------*/
router.route("/singup")
.get( (req, res) => {
  res.render("users/singup.ejs");
})
.post(
  wrapAsync(userControler.signup)
);

/*---------------------------------- /login    --------------------------------------------------*/
router.route("/login")
    .get((req, res) => {
        res.render("users/login.ejs");
    })
    .post(
     isLoggedIn, // Apply isLoggedIn middleware
      passport.authenticate("local", {
          failureRedirect: "/login",
          failureFlash: true
      }),
      (req, res) => {
          req.flash("success", "Welcome back to wonder lust");
          let redirectUrl = req.session.redirectUrl || "/listings";
          res.redirect(redirectUrl);
      }
  );
  
/*----------------------------------logout--------------------------------------------------*/

router.get("/logout",(req,res,next)=>{
  req.logOut;
  req.flash("error","you are logged out!");
    res.redirect("/listings");
});

/*------------------------------------------------------------------------------------*/

module.exports = router;
