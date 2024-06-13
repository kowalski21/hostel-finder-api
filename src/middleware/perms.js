const { sendError, errorCodes } = require("../utils/utils-error");

exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    sendError("Authorization Error", 403, errorCodes.FORBIDDEN);
  }

  next();
};

exports.checkOwnership = () => {
  // check if owner owns a resource
  // if admin : allow, else check if owner is the one
};
