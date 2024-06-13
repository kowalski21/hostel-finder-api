const jwt = require("jsonwebtoken");
const { sendError, errorCodes } = require("./utils-error");
exports.verifyJWT = (token, secret) => {
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (error) {
    if (err instanceof jwt.TokenExpiredError) {
      sendError("Expired Token", 401, errorCodes.TOKEN_EXPIRED);
    } else if (err instanceof jwt.JsonWebTokenError) {
      sendError("Invalid Token", 401, errorCodes.TOKEN_INVALID);
    } else {
      sendError("Service Unavailable", 401, errorCodes.SERVICE);
    }
  }

  return payload;
};
