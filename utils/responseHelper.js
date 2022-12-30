const success = (res, message, data, statusCode = 200) => {
  const responseBody = { success: true };
  if (message) responseBody.message = message;
  if (data) {
    if (Array.isArray(data)) {
      responseBody.docs = data;
    } else {
      responseBody.doc = data;
    }
  }
  responseBody.statusCode = statusCode;
  return res.status(statusCode).json(responseBody);
};

const failure = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

module.exports = {
  success,
  failure,
};
