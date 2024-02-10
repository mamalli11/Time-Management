const router = require("express").Router();

const { UserController } = require("../../controllers/Auth/user.controller");

const { authenticated } = require("../../middlewares/auth");

//^  @desc   Login Page
//&  @route  GET /
router.get("/", UserController.loginPage);

//^  @desc   Login Handle
//&  @route  POST /login
router.post("/login", UserController.handleLogin, UserController.rememberMe);

//^  @desc   SingUp Handle
//&  @route  POST /singUp
router.post("/singUp", UserController.handleSingUp, UserController.rememberMe);

//^  @desc   Logout Handle
//&  @route  GET /logout
router.get("/logout", authenticated, UserController.logout);

module.exports = { UserRouter: router };
