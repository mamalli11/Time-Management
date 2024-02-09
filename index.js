const Application = require("./app/server");

new Application(process.env.PORT, process.env.MONGODB_URL);