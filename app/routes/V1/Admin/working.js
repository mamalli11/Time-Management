const router = require("express").Router();

const { WorkingController } = require("../../../controllers/admin/working.controller");

const { authenticated } = require("../../../middlewares/auth");

//^  @desc   Company Page
//&  @route  GET /
router.get("/", authenticated, WorkingController.indexCompanyPage);

//^  @desc   Save New Working Time
//&  @route  POST /
// router.post("/newTime", authenticated, WorkingController.handelSaveWorkingTime);
router.post("/newTime",   WorkingController.handelSaveWorkingTime);

//^  @desc   Create New Company
//&  @route  POST /
// router.post("/newCompany", authenticated, WorkingController.createCompany);
router.post("/newCompany", WorkingController.createCompany);

//^  @desc   Delete Company
//&  @route  DELETE /
router.delete("/deleteCompany/:companyId", WorkingController.deleteCompany);

module.exports = { WorkingRouter: router };
