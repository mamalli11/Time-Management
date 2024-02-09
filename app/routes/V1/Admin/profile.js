const router = require("express").Router();

const { ProfileController } = require("../../../controllers/admin/profile.controller");

const { authenticated } = require("../../../middlewares/auth");

//^  @desc   Index Profile Page
//&  @route  GET /
router.get("/", authenticated, ProfileController.index);

module.exports = { ProfileRouter: router };
