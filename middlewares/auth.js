/* eslint-disable no-underscore-dangle */
const models = require("../models");
const { unAuthorized } = require("../utils/customErrors");
const { verifyToken } = require("../utils/token");

const authorized = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split("Bearer")[1].trim();
      const userData = verifyToken(token);
      req.user = userData;
      next();
    } else {
      unAuthorized();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const authorizedOnModel = (Model, param, field) => async (req, res, next) => {
  try {
    const modelId = req.params[param];

    const model = await models[Model].findById(modelId);
    const belongsToId = model[field].toString();
    if (belongsToId === req.user._id) {
      next();
    } else {
      unAuthorized();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authorized,
  authorizedOnModel,
};
