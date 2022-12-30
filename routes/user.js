const express = require("express");
const { userController } = require("../controllers");
const { validateModelId } = require("../validators/model");
const uploadFile = require("../utils/fileUploadCloudinary");
const { authorized } = require("../middlewares/auth");

const { registerUser, loginUser, updateUser, getUser } = userController;

const router = express.Router();

router.param("userId", validateModelId("User"));

router.route("/").post(uploadFile, registerUser);
router.route("/login").post(loginUser);
router
  .route("/:userId")
  .get(authorized, getUser)
  .put(authorized, uploadFile, updateUser);

module.exports = router;
