const express = require("express");
const router = express.Router();

const wrapAsync = require("../utility/wrapAsync");

const { redirecyUrl } = require("../middleware");
const userControler = require("../controler/user");

/*-----------------------------------signup-------------------------------------------------*/

router.get("/singup", (req, res) => {
  res.render("users/singup.ejs");
});

/*------------------------------------signup------------------------------------------------*/

router.post(
  "/singup",
  wrapAsync(userControler.signup)
);

/*----------------------------------login--------------------------------------------------*/
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
  });
  
/*----------------------------------login--------------------------------------------------*/

router.post(
  "/login",redirecyUrl,userControler.login)

/*----------------------------------logout--------------------------------------------------*/

router.get("/logout",(req,res,next)=>{
  req.logOut;
  req.flash("error","you are logged out!");
    res.redirect("/listings");
});

/*------------------------------------------------------------------------------------*/

module.exports = router;
