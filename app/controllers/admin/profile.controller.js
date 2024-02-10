const Controller = require("../controller");

class ProfileController extends Controller {
    async index(req, res, next) {
        try {
            res.render("private/profile/index", {
                path: "/profile",
                layout: "./layouts/dashLayout",
                user: {
                    fullName: req.user.fullName,
                    email: req.user.email,
                    phone: req.user.phone,
                    profile: req.user.profile,
                    gender: req.user.gender,
                },
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { ProfileController: new ProfileController() };
