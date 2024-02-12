const Controller = require("../controller");

const Users = require("../../models/Users");
const EmploymentHistory = require("../../models/EmploymentHistory");
const { jalaliToUTCTimeStamp, toEnglishDigits } = require("../../utils/date");

class WorkingController extends Controller {
    async indexCompanyPage(req, res, next) {
        try {
            res.render("private/company/index", {
                path: "/working",
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
    async handelSaveWorkingTime(req, res, next) {
        try {
            const { datePiker, timeList } = req.body;
            console.log({ datePiker, timeList });

            const splitDate = datePiker.split("/");
            let date = {
                year: +toEnglishDigits(splitDate[0]),
                month: +toEnglishDigits(splitDate[1]),
                day: +toEnglishDigits(splitDate[2]),
            };

            const newTime = {
                date: jalaliToUTCTimeStamp(date.year, date.month, date.day),
                times: timeList,
            };

            const employmentHistoryId = req.user.employmentHistory[req.user.employmentHistory.length - 1];
            await EmploymentHistory.findByIdAndUpdate(employmentHistoryId, { $push: { workingTimes: newTime } }, { new: true });
            res.status(200).json("OK");
        } catch (err) {
            next(err);
        }
    }
    async createCompany(req, res, next) {
        try {
            const { companyName, address, maxLeavePerMonth, logo, startDate, dateAmount, amount } = req.body;

            const splitDate = startDate.split("/");
            let date = {
                year: +toEnglishDigits(splitDate[0]),
                month: +toEnglishDigits(splitDate[1]),
                day: +toEnglishDigits(splitDate[2]),
            };

            const user = await Users.findById(req.user._id).populate({ path: "employmentHistory" });
            console.log(user);

            if (user.employmentHistory.map((i) => i.companyName == companyName)) {
                return res.status(200).json({ Message: "Company already exist " });
            }
            const data = await EmploymentHistory.create({
                companyName,
                address,
                maxLeavePerMonth,
                logo,
                startDate: jalaliToUTCTimeStamp(date.year, date.month, date.day),
                salaries: { date: dateAmount, amount },
            });

            user.employmentHistory.push(data.id);
            await user.save();
            res.status(201).json({ message: "Created Company", data: { user, data } });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { WorkingController: new WorkingController() };
