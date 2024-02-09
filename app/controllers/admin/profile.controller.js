const Controller = require("../controller");

class ProfileController extends Controller {
    async index(req, res, next) {
        try {
            res.render("private/profile/index", {
                path: "/profile",
                layout: "./layouts/dashLayout",
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

module.exports = { ProfileController: new ProfileController() };
