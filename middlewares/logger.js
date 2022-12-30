const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const logsDirPath = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDirPath)) fs.mkdirSync(logsDirPath);

const date = new Date();

const logPath = path.join(
  logsDirPath,
  `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}_request.log`
);

const accessLogStream = fs.createWriteStream(logPath, {
  flags: "a",
});

const logger = () => morgan("combined", { stream: accessLogStream });

module.exports = logger;
