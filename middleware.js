module.exports.isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       req.flash("error","you are not logined");
       return res.redirect("/login");
    }
    next();
}