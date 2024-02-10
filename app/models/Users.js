const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Invalid email address format",
            },
        },
        phone: { type: String, default: null, maxlength: 11 },
        profile: { type: String, default: "https://cdn-icons-png.flaticon.com/512/3541/3541871.png" },
        password: { type: String, required: true, minlength: 4, maxlength: 255 },
        gender: { type: String, default: "unknown", enum: ["male", "female", "unknown"] },
        isAdmin: { type: Boolean, default: false },
        employmentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmploymentHistory" }],
    },
    {
        timestamps: true,
    }
);

usersSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

usersSchema.statics.findByCredentials = function (Email, Password) {
    let Users = this;

    return Users.findOne({
        Email,
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(Password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

module.exports = mongoose.model("Users", usersSchema);
