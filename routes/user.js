const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync");
const userControler = require("../controler/user");
const passport = require("passport");

/*----------------------------------- /signup -------------------------------------------------*/
router
  .route("/singup")
  .get((req, res) => {
    res.render("users/singup.ejs");
  })
  .post(wrapAsync(userControler.signup));

/*---------------------------------- /login    --------------------------------------------------*/
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(userControler.login);

/*----------------------------------logout--------------------------------------------------*/

router.get("/logout", (req, res, next) => {
  req.logOut;
  req.flash("error", "you are logged out!");
  res.redirect("/listings");
});

/*------------------------------------------------------------------------------------*/

module.exports = router;
