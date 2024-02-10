const mongoose = require("mongoose");

const TimeSchema = new Schema({
    date: { type: String, required: true },
    times: [{ type: String, required: true }],
});

const LeaveSchema = new Schema({
    date: { type: String, required: true },
    times: { type: String, required: true },
    leaveType: {
        type: String,
        required: true,
        default: "entitlement",
        enum: ["withoutSalary", "illness", "entitlement", "emergency", "educational", "anHour"],
    },
});

const SalarySchema = new Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true, trim: true },
});

const EmploymentHistorySchema = new Schema({
    companyName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    logo: { type: String },
    address: { type: String },
    maxLeavePerMonth: { type: Number, default: 60, trim: true },
    workingTimes: [{ type: TimeSchema }],
    leaves: [{ type: LeaveSchema }],
    salaries: [{ type: SalarySchema }],
});

module.exports = mongoose.model("EmploymentHistory", EmploymentHistorySchema);
