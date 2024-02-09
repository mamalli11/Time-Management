const passport = require("passport");

const Controller = require("../controller");

class UserController extends Controller {
    async loginPage(req, res, next) {
        try {
            if (req.user) {
                return res.redirect("/dashboard");
            }
            res.render("login", {
                path: "login",
                layout: false,
                message: req.flash("success_msg"),
                error: req.flash("error"),
            });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    async handleLogin(req, res, next) {
        try {
            console.log(req.body);

            passport.authenticate("local", {
                successRedirect: "/dashboard",
                successReturnToOrRedirect: "/dashboard",
                failureRedirect: "/",
                failureFlash: true,
            })(req, res, next);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async rememberMe(req, res) {
        console.log("******************** remember ==> ", req.body.remember);
        if (req.body.remember) {
            req.session.cookie.originalMaxAge = 168 * 60 * 60 * 1000; // 7 day 24
        } else {
            req.session.cookie.expire = null;
        }
        res.redirect("/dashboard");
    }
    logout(req, res, next) {
        try {
            req.session = null;
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect("/login");
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { UserController: new UserController() };
