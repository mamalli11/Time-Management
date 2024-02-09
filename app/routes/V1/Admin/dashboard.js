const router = require("express").Router();

const { DashboardController } = require("../../../controllers/Admin/dashboard.controller");

const { authenticated } = require("../../../middlewares/auth");

//^  @desc   Index Page
//&  @route  GET /
router.get("/", authenticated, DashboardController.index);

module.exports = { DashboardRouter: router };