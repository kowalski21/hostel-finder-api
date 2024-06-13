const BaseException = require("../exceptions/base");

exports.sendError = (message, status, code) => {
  throw new BaseException(message, status, code);
};

exports.errorCodes = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  FORBIDDEN: "FORBIDDEN_ERROR",
  NOT_FOUND: "NOT_FOUND",
  PAYLOAD: "INVALID_PAYLOAD",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  SERVICE: "UNAVAILABLE_SERVICE",
};
