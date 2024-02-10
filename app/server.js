const path = require("path");

const morgan = require("morgan");
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const expressLayout = require("express-ejs-layouts");

require("dotenv").config();
require("./config/passport"); //* Passport Configuration

const { Routes } = require("./routes/router");

module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;
    constructor(PORT, DB_URI) {
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.initClientSession();
        this.initTemplateEngine();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }
    configApplication() {
        // this.#app.use(cors()); //* Allow Cross-Origin requests
        this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static(path.join(__dirname, "..", "public")));
    }
    createServer() {
        this.#app.listen(this.#PORT, () => {
            console.info(`run > http://localhost:${this.#PORT} ✔`);
        });
    }
    connectToMongoDB() {
        mongoose.connect(this.#DB_URI, (error) => {
            if (!error) return console.log("conected to MongoDB ✔");
            return console.log(error.message);
        });
        mongoose.connection.on("connected", () => {
            console.log("mongoose connected to DB ✔");
        });
        mongoose.connection.on("disconnected", () => {
            console.log("mongoose connection is disconnected ❌");
        });
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("mongoose connection close ❌");
            process.exit(0);
        });
    }
    initTemplateEngine() {
        this.#app.use(expressLayout);
        this.#app.set("view engine", "ejs");
        this.#app.set("views", "views");
        this.#app.set("layout", "./layouts/dashLayout");
        this.#app.use(function (req, res, next) {
            res.locals = { USER: req.user };
            next();
        });
    }
    initClientSession() {
        this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
        this.#app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                unset: "destroy",
                store: MongoStore.create({ mongoUrl: this.#DB_URI }),
            })
        );
        //* Passport
        this.#app.use(passport.initialize());
        this.#app.use(passport.session());
        this.#app.use(flash()); //* Flash
    }
    createRoutes() {
        this.#app.use(Routes);
        this.#app.use(require("./controllers/errorController").get404); //* 404 Page
    }
    errorHandling() {
        this.#app.use((error, req, res, next) => {
            error.statusCode = error.statusCode || 500;
            error.status = error.status || "error";
            res.status(error.statusCode).json({
                status: error.status,
                error,
                message: error.message,
                stack: error.stack,
            });
        });
    }
};
