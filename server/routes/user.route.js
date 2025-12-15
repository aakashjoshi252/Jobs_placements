const express = require("express")
const userRoute = express.Router();
const userController= require("../controllers/user.controller.js")
const { protect } = require(`../middlewares/auth.middleware.js`);


userRoute.post("/register",userController.createUser),          // for registration
userRoute.post("/login",userController.loginUser)                // for user Login
userRoute.put("/:id",userController.updateUsersById) 
userRoute.get("/me", protect, userController.getLoggedInUser)   // to get logged in user details;

userRoute.delete("/users/:id",userController.deleteUsersById)



module.exports= userRoute;