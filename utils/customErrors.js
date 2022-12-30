const unAuthorized = () => {
  const error = new Error();
  error.name = "CustomError";
  error.message = "You are not authorized to perform this action.";
  error.statusCode = 401;
  throw error;
};

const notFound = (entity) => {
  const error = new Error();
  error.name = "CustomError";
  error.message = `${entity} not found`;
  error.statusCode = 404;
  throw error;
};

const badRequest = (message) => {
  const error = new Error();
  error.name = "CustomError";
  error.message = message;
  error.statusCode = 400;
  throw error;
};

module.exports = {
  unAuthorized,
  notFound,
  badRequest,
};
