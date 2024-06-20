const BaseException = require("../exceptions/base");
const { toArray } = require("../utils/to-array");

const errorHandler = (err, req, res, next) => {
  let payload = {
    errors: [],
  };

  const errors = toArray(err);

  if (errors.some((err) => err instanceof BaseException === false)) {
    res.status(500);
  } else {
    let status = errors[0].status;
    for (const err of errors) {
      if (status !== err.status) {
        status = 500;
        break;
      }
    }
    res.status(status);
  }
  for (const err of errors) {
    res.status(err.status);
    if (process.env.NODE_ENV === "development") {
      err.extensions = {
        ...(err.extensions || {}),
        stack: err.stack,
      };
    }
    if (err instanceof BaseException) {
      res.status(err.status);
      payload.errors.push({
        message: err.message,
        extensions: {
          ...err.extensions,
          code: err.code,
        },
      });
    } else {
      res.status(500);
      payload = {
        errors: [{ message: err.message, extensions: { ...err.extensions, code: "INTERNAL_SERVER_ERROR" } }],
      };
    }
  }

  // console.log(payload);

  return res.json(payload);
};

module.exports = errorHandler;
