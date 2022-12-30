const express = require("express");
const userRoutes = require("./user");
const postRoutes = require("./post");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/posts", postRoutes);

module.exports = router;
