const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.isLoggedIn= async function(req,res,next){
    let { token } = req.cookies;

   try{
    if(token === ""){
        req.flash("error", "Login first")
        res.redirect("/")
    }
    else{
        let decoded= jwt.verify(token,process.env.SECRET_KEY);
          let user= await userModel
          .findOne({email: decoded.email})
          .select("-password");
          req.user=user;
        next();
    }
   }catch{
    req.flash("error", "Login first")
    res.redirect("/")
    
   }
   }

   module.exports.redirectToProfile= async function(req,res,next){
    let { token } = req.cookies;

   try{
    if(token){
        jwt.verify(token.process.env.SECRET_KEY)
        req.flash("error", "Logout first")
        res.redirect("/profile")
    }
    else{
       return next();
    }
   }catch{
    req.flash("error", "logout first")
    res.redirect("/profile")
   }
   }

   