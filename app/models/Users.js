const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema(
    {
        Fullname: { type: String, required: true, trim: true },
        Email: { type: String, required: true, unique: true, trim: true },
        Phone: { type: String, default: null, maxlength: 11 },
        Profile: {
            type: String,
            default: "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png",
        },
        Password: { type: String, required: true, minlength: 4, maxlength: 255 },
        Gender: { type: String, default: "unknown", enum: ["male", "female", "unknown"] },
        isAdmin: { type: Boolean, default: false },
        Times: [],
        Morakhsi: [],
        MaxMorakhsi: { type: Number, required: true, default: 60, trim: true },
        TypeMorakhsi: { type: String, default: "entitlement", enum: ["withoutSalary", "illness", "entitlement", "emergency", "educational", "anHour"] },
    },
    {
        timestamps: true,
    }
);

usersSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("Password")) return next();

    bcrypt.hash(user.Password, 10, (err, hash) => {
        if (err) return next(err);

        user.Password = hash;
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
            bcrypt.compare(Password, user.Password, (err, res) => {
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
