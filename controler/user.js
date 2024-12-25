/** @format */

// const passport = require("passport");
// const user = require("../models/user");
// /*------------------------------------------------------------------------------------*/
// module.exports.signup=async (req, res) => {
//     try {
//       let { username, email, password } = req.body;
//       const newuser = new user({ username, email });
//       let registerUser = await user.register(newuser, password);

//       req.login(registerUser, function(err) {
//         if (err) { return next(err); }

//       });

//       req.flash("sucess", "welcome to hotel-rent");
//       res.redirect("/listings");

//     } catch (e) {
//       req.flash("error", e.message);
//       res.redirect("/singup");
//     }
//   }
// /*------------------------------------------------------------------------------------*/

// module.exports.login = passport.authenticate("local", {
//   failureRedirect: "/login",
//   failureFlash: true
// }),
// async (req, res) => {
//   req.flash("sucess", "welcome back to hotel-rent");
//   let redurl = res.locals.redirecyUrl || "/listings";
//   res.redirect(redurl);
//   res.redirect("/listings")
// }

// /*------------------------------------------------------------------------------------*/

const passport = require("passport");
const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
	try {
		let { username, email, password } = req.body;
		const newUser = new User({ username, email });
		const registeredUser = await User.register(newUser, password);

		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
		});

		req.flash("sucess", "Welcome to hotel-rent");
		res.redirect("/listings");
	} catch (e) {
		req.flash("error", e.message);
		console.log(e);
		res.redirect("/signup");
	}
};

// module.exports.login = (req, res, next) => {
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, () => {
//     req.flash("sucess", "Welcome back to hotel-rent");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
//   });
// };

module.exports.login = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			req.flash("error", info.message);
			return res.redirect("/login");
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("sucess", "Welcome back to hotel-rent");
			let redirectUrl = res.locals.redirectUrl || "/listings";
			res.redirect(redirectUrl);
		});
	})(req, res, next);
};
