const router = require("express").Router();

const { DashboardRouter } = require("./Admin/dashboard");
const { ProfileRouter } = require("./Admin/profile");
const { WorkingRouter } = require("./Admin/working");

router.use("/", DashboardRouter);
router.use("/profile", ProfileRouter);
router.use("/working", WorkingRouter);

module.exports = { AdminRoutes: router };
