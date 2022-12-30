const models = require("../models");
const { notFound } = require("../utils/customErrors");

const validateModelId = (modelName) => async (req, res, next, modelId) => {
  try {
    const modelExists = await models[modelName].findOne({
      _id: modelId,
      deleted: false,
    });
    if (modelExists) {
      next();
      return;
    }
    notFound(modelName);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateModelId,
};
