const router = require("express").Router();

const { checkLogin } = require("../middlewares/auth");

const { UserRouter } = require("./V1/user");
const { AdminRoutes } = require("./V1/admin.routes");

router.use("/", UserRouter);

router.use("/dashboard", checkLogin, AdminRoutes);

module.exports = { Routes: router };
