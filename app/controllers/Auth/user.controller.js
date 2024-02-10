const passport = require("passport");

const Controller = require("../controller");

const Users = require("../../models/Users");

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
    async handleSingUp(req, res, next) {
        try {
            const { fullName, email, password } = req.body;
            console.log(req.body);
            const user = await Users.findOne({ email });

            if (user) {
                return res.render("register", {
                    pageTitle: "ثبت نام کاربر",
                    path: "/register",
                    error: { message: "کاربری با این ایمیل موجود است" },
                });
            }

            await Users.create({ fullName, email, password });

            req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
            res.redirect("/dashboard");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async rememberMe(req, res) {
        
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
            return res.clearCookie("connect.sid").redirect("/");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { UserController: new UserController() };
