const { prisma } = require("../db");
const { verifyJWT } = require("../utils/jwt");
const { sendError, errorCodes } = require("../utils/utils-error");
const _ = require("lodash");
// const jwt = require("jsonwebtoken");
const authenticateHandler = async (req, res, next) => {
  const token = req.token;
  req.user = null;

  if (req.token) {
    const payload = verifyJWT(token, process.env.JWT_SECRET);
    // console.log(payload);

    const _user = await prisma.user.findUnique({
      where: {
        id: payload.id,
        status: "active",
      },
    });

    if (!_user) {
      sendError("User does not exist", 404, errorCodes.NOT_FOUND);
    }

    const user = _.omit(_user, ["password"]);
    req.user = user;
  }

  next();
};

module.exports = { authenticateHandler };
