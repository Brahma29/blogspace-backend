const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./configs/database");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const serverless = require("serverless-http");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(logger());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/.netlify/functions/api", (req, res) => {
  return res.status(200).json({
    message: "Api is up",
  });
});

app.use("/.netlify/functions/api/", routes);

app.use(errorHandler);

// app.listen(PORT, () =>
//   // eslint-disable-next-line no-console
//   console.log(`API is listening on port - ${PORT} in ${NODE_ENV} mode`)
// );

module.exports = app;
module.exports.handler = serverless(app);
