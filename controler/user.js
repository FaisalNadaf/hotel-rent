
const passport = require("passport");
const user = require("../models/user");
/*------------------------------------------------------------------------------------*/
module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new user({ username, email });
      let registerUser = await user.register(newuser, password);
 
      // req.login(registerUser, function(err) {
      //   if (err) { return next(err); }
       
      // }); 

      req.flash("sucess", "welcome to wonder lust");
      res.redirect("/listings");
   
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/singup");
    }
  }
/*------------------------------------------------------------------------------------*/

module.exports.login=
passport.authenticate("local",{ failureRedirect:"/login", failureFlash: true }),
async (req, res) => {
  req.flash("sucess","welcom back to wonder lust")
  let redurl=res.locals.redirecyUrl || "/listings";
   res.redirect(redurl);
    // res.redirect("/listings")
}

/*------------------------------------------------------------------------------------*/