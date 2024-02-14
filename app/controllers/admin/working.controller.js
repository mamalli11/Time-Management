const Controller = require("../controller");

const Users = require("../../models/Users");
const EmploymentHistory = require("../../models/EmploymentHistory");
const { jalaliToUTCTimeStamp, toEnglishDigits, convertToPersianDate } = require("../../utils/date");

class WorkingController extends Controller {
    async indexCompanyPage(req, res, next) {
        try {
            const com = await Users.findById(req.user.id).select("employmentHistory").populate({ path: "employmentHistory" });

            res.render("private/company/index", {
                path: "/working",
                layout: "./layouts/dashLayout",
                companys: com.employmentHistory,
                moment: convertToPersianDate,
            });
        } catch (err) {
            next(err);
        }
    }
    async deleteCompany(req, res, next) {
        try {
            const { companyId } = req.params;
            const company = await EmploymentHistory.findByIdAndRemove(companyId);
            const users = await Users.findById(req.user.id).select("employmentHistory");
            console.log({ companyId,company, users });
            users.employmentHistory = users.employmentHistory.filter((el) => el.toString().indexOf(companyId) == -1);
            await users.save();

            res.status(200).json({ message: "شرکت حذف شد." });
        } catch (err) {
            next(err);
        }
    }
    async handelSaveWorkingTime(req, res, next) {
        try {
            const { datePiker, timeList } = req.body;
            console.log({ datePiker, timeList });

            if (timeList.length == 0) {
                return res.status(400).json({ Message: "هیچ زمانی ارسال نشده است" });
            }

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

            res.status(201).json({ message: "Time saved" });
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

            const user = await Users.findById(req.user._id, { password: 0, isAdmin: 0 }).populate({ path: "employmentHistory" });

            if (user.employmentHistory.length != 0) {
                if (user.employmentHistory.find((i) => i.companyName === companyName)) {
                    return res.status(400).json({ message: "این شرکت قبلا ثبت شده است" });
                }

                await EmploymentHistory.findByIdAndUpdate(
                    { _id: user.employmentHistory[user.employmentHistory.length - 1].id },
                    {
                        status: "settlement",
                    }
                );
            }

            const data = await EmploymentHistory.create({
                companyName,
                address,
                maxLeavePerMonth,
                logo,
                startDate: jalaliToUTCTimeStamp(date.year, date.month, date.day),
                // salaries: { date: dateAmount, amount },
            });

            user.employmentHistory.push(data.id);
            await user.save();
            res.status(201).json({ message: "شرکت جدید باموفقیت ثبت شد", data: { data } });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = { WorkingController: new WorkingController() };
