const sendResponse = (res, statusCode, options = {}) => {
  const {
    success = true,
    message = "",
    data = null,
    count,
  } = options;

  const response = {
    success,
    message,
  };

  if (count !== undefined) response.count = count;
  if (data !== null) response.data = data;

  res.status(statusCode).json(response);
};

module.exports = sendResponse;
