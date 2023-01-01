/* eslint-disable camelcase */
const { User } = require("../models");
const { success, failure } = require("../utils/responseHelper");
const { generateToken } = require("../utils/token");

const defaultUserProfile =
  "https://img.freepik.com/free-icon/user_318-563623.jpg?w=2000";

const registerUser = async (req, res, next) => {
  try {
    const { file } = req;
    const { first_name, last_name, email, password } = req.body;
    await User.create({
      first_name,
      last_name,
      email,
      password,
      profile: file ? file.url : defaultUserProfile,
    });
    return success(res, "Registered successfully.", undefined, 201);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken({
        // eslint-disable-next-line no-underscore-dangle
        _id: user._id,
        email: user.email,
        role: user.role,
      });
      return success(res, "Logged in successfully", { token }, 200);
    }
    return failure(res, `Invalid credentials`, 400);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const updateUser = async (req, res, next) => {
  try {
    const { file } = req;
    const { userId } = req.params;
    const { first_name, last_name, password } = req.body;
    const user = await User.findOne({ _id: userId });
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    if (password) {
      user.password = password;
    }
    user.profile = file ? file.url : user.profile;
    await user.save();
    return success(res, `Updated successfully`, undefined, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    return success(res, `User fetched successfully`, user, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return success(res, `User fetched successfully`, user, 200);
  } catch (error) {
    next(error);
  }
  return undefined;
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUser,
  getUserProfile,
};
