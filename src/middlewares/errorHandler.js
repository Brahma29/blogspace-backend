/* eslint-disable no-unused-vars */
const { failure } = require("../utils/responseHelper");

const handleValidationErrors = (err, res) => {
  const { errors } = err;
  const firstErrorKey = Object.keys(errors)[0];
  const firstErrorMessage = errors[firstErrorKey].message;
  return failure(res, firstErrorMessage, 400);
};

const uniqueValidationErrors = (err, res) => {
  const keyValueObject = err.keyValue;
  const key = Object.keys(keyValueObject)[0];
  const value = keyValueObject[key];
  return failure(res, `${value} ${key} already exists`, 400);
};

const customErrors = (err, res) => {
  return failure(res, err.message, err.statusCode);
};

const tokenErrors = (err, res) => {
  return failure(res, "Unauthorized access", 401);
};

const errorHandler = (err, req, res, next) => {
  const errorName = err.name;
  if (errorName === "ValidationError") {
    return handleValidationErrors(err, res);
  }

  if (err.code === 11000) {
    return uniqueValidationErrors(err, res);
  }

  if (err.name === "CustomError") {
    return customErrors(err, res);
  }

  if (err.name === "JsonWebTokenError") {
    return tokenErrors(err, res);
  }

  return res.status(500).json({
    err,
  });
};

module.exports = errorHandler;
