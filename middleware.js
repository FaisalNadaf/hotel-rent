module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated){
        req.session.redirecyUrl=req.originalUrl;
       req.flash("error","you are not logined");
       return res.redirect("/login");
    }
    next();
}

module.exports.redirecyUrl=(req,res,next)=>{
    if(req.session.redirecyUrl){
        res.locals.redirecyUrl=req.session.redirecyUrl;
    }
    next();
}