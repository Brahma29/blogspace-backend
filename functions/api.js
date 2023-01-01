const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("../configs/database");
const routes = require("../routes");
const errorHandler = require("../middlewares/errorHandler");
const serverless = require("serverless-http");

const router = express.Router();

dotenv.config();
connectDB();

// const PORT = process.env.PORT || 5000;
// const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Api is up",
  });
});

app.use(errorHandler);

app.use("/", router);
app.use("/api", routes);

module.exports.handler = serverless(app);
