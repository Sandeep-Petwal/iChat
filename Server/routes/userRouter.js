const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController")
const {auth} = require("../middleware/auth"); // TODO: middleware to protect routes


userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
userRouter.get("/verify", userController.verify)


userRouter.get("/allusers", userController.getAllUsers); // get all users
userRouter.put("/update/:user_id", userController.updateUser)



module.exports = userRouter