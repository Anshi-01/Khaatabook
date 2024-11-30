const userModel = require("../models/userModel");
const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const { isLoggedIn } = require("../middlewares");
require('dotenv').config();
const flash= require("connect-flash");




module.exports.homepageController= function(req,res){
    res.render("index",{isLoggedin : false});
}

module.exports.showRegisterController=function(req,res){
    res.render("register",{isLoggedin : false});
}

module.exports.registerController= async function(req,res){

    const {email, username, name, password}= req.body;

   try{ let user= await userModel.findOne({email});
  

   if(user) return req.flash("error", "You already have an account!");


   let salt= await bcrypt.genSalt(10);
   let hash= await bcrypt.hash(password,salt);

   user= await userModel.create({
       email,
       username,
       name, 
       password: hash,
   });

   let token= jwt.sign({
       id: user._id, email: user.email,
   },process.env.SECRET_KEY);

   res.cookie("token",token);
   res.redirect("/profile");
}
catch(err){
    res.send(err);
}
}

module.exports.loginController= async function(req,res){
    let {email,username,password}=req.body;
    
try{
    
    //to check email is correct?
    let user= await userModel.findOne({email});
    if(!user) {
         req.flash("error", "You do not have an account");
         return res.redirect("/")
        }

    //to check password is correct?
    let result= await bcrypt.compare(password, user.password);

    if(result){
        let token= jwt.sign({
            id: user._id, email: user.email, 
        },process.env.SECRET_KEY);
     
        res.cookie("token",token);
        res.redirect("/profile");
    }
    else{
        req.flash("error","email or password is incorrect");
        res.redirect("/")
    }
}catch(err){
    req.flash( "error","email or password is incorrect");
}
}

module.exports.logoutController = async function(req,res){
    res.cookie("token", "");
    res.redirect("/") 
}

module.exports.profileController = async function (req, res, next) {
    try {
        // Fetch the user and populate the 'hisaabs' field
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("hisaabs");

        let hisaabs = user.hisaabs; // Get the hisaabs array

        // Extract filters from the query parameters
        const { startDate, endDate, byDate } = req.query;

        // Filter by date range
        if (startDate || endDate) {
            const filter = {};
            if (startDate) filter.$gte = new Date(startDate);
            if (endDate) filter.$lte = new Date(endDate);

            hisaabs = hisaabs.filter((hisaab) => {
                const createdDate = new Date(hisaab.createdAt);
                return (!filter.$gte || createdDate >= filter.$gte) &&
                       (!filter.$lte || createdDate <= filter.$lte);
            });
        }

        // Sort by date if 'byDate' is provided (1 for Oldest First, -1 for Newest First)
        if (byDate) {
            const sortOrder = parseInt(byDate, 10);
            hisaabs = hisaabs.sort((a, b) => {
                return sortOrder === 1
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            });
        }

        // Render the profile page with filtered and sorted hisaabs
        res.render("profile", { user: { ...user._doc, hisaabs } });
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong while filtering hisaabs.");
    }
};
