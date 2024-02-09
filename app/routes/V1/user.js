const router = require("express").Router();

const { UserController } = require("../../controllers/Auth/user.controller");

const { authenticated } = require("../../middlewares/auth");

//^  @desc   Login Page
//&  @route  GET /login
router.get("/", UserController.loginPage);

//^  @desc   Login Handle
//&  @route  POST /login
router.post("/login", UserController.handleLogin, UserController.rememberMe);

//^  @desc   Logout Handle
//&  @route  GET /logout
router.get("/logout", authenticated, UserController.logout);

module.exports = { UserRouter: router };
