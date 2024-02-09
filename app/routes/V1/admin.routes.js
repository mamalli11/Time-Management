const router = require("express").Router();

const { DashboardRouter } = require("./Admin/dashboard");
const { ProfileRouter } = require("./Admin/profile");

router.use("/", DashboardRouter);
router.use("/profile", ProfileRouter);

module.exports = { AdminRoutes: router };
