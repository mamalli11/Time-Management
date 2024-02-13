const moment = require("moment-jalaali");

function jalaliToUTCTimeStamp(year, month, day) {
    const format = new Intl.DateTimeFormat("en-u-ca-persian", { dateStyle: "short", timeZone: "UTC" });
    let g = new Date(Date.UTC(2000, month, day));
    g = new Date(g.setUTCDate(g.getUTCDate() + 226867));
    const gY = g.getUTCFullYear() - 2000 + year;
    g = new Date(
        (gY < 0 ? "-" : "+") + ("00000" + Math.abs(gY)).slice(-6) + "-" + ("0" + (g.getUTCMonth(g) + 1)).slice(-2) + "-" + ("0" + g.getUTCDate(g)).slice(-2)
    );
    let [pM, pD, pY] = [...format.format(g).split("/")],
        i = 0;
    g = new Date(g.setUTCDate(g.getUTCDate() + ~~(year * 365.25 + month * 30.44 + day - (pY.split(" ")[0] * 365.25 + pM * 30.44 + pD * 1)) - 2));
    while (i < 4) {
        [pM, pD, pY] = [...format.format(g).split("/")];
        if (pD == day && pM == month && pY.split(" ")[0] == year) return +g;
        g = new Date(g.setUTCDate(g.getUTCDate() + 1));
        i++;
    }
    throw new Error("Invalid Persian Date!");
}

function toEnglishDigits(num) {
    const id = {
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
    };
    return num
        ? num.toString().replace(/[۰-۹]/g, function (w) {
              return id[w] || w;
          })
        : null;
}

moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

function convertToPersianDate(utcDate) {
    return moment(utcDate).format('jYYYY/jM/jD'); // فرمت تاریخ شمسی
}
const PersianDate = (date) => {
    const nDate = new Date(date);
    const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return nDate.toLocaleDateString("fa-IR", dateOptions);
};

module.exports = { toEnglishDigits, jalaliToUTCTimeStamp, convertToPersianDate, PersianDate };
