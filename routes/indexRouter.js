const express= require("express");
const router = express.Router();
const {homepageController,registerController,showRegisterController ,loginController, logoutController,profileController}= require("../controllers/indexController");
const { isLoggedIn ,redirectToProfile} = require("../middlewares");

router.get("/", redirectToProfile,homepageController);
router.get("/register",showRegisterController)
router.post("/register",registerController)
router.post("/login",loginController)
router.get("/logout",logoutController)
router.get("/profile",isLoggedIn,profileController)



module.exports= router;
