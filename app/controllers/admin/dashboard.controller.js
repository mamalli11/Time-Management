const Controller = require("../controller");

class DashboardController extends Controller {
    async index(req, res, next) {
        try {
            res.render("private/dashboard", {
                path: "/dashboard",
                layout: "./layouts/dashLayout",
                // UserLength: await Users.find().countDocuments(),
                // ProductLength: await Products.find().countDocuments(),
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

module.exports = { DashboardController: new DashboardController() };
