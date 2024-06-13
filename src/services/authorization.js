const { prisma } = require("../db");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const { sendError, errorCodes } = require("../utils/utils-error");
const ms = require("ms");

class AuthenticationService {
  constructor() {
    this.prisma = prisma;
    this.secret = process.env.JWT_SECRET;
  }

  async authenticate(username, password) {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user || user.status !== "active") {
      sendError("Invalid User Credentials", 401, errorCodes.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      sendError("Invalid User Credentials", 401, errorCodes.INVALID_CREDENTIALS);
    }

    if ((await argon.verify(user.password, password)) === false) {
      sendError("Invalid User Credentials", 401, errorCodes.INVALID_CREDENTIALS);
    }

    const payload = {
      id: user.id,
    };

    const access_token = jwt.sign(payload, this.secret, { expiresIn: process.env.ACCESS_TOKEN_TTL });

    return {
      access_token,
      expires: ms(process.env.ACCESS_TOKEN_TTL),
      id: user.id,
    };
  }

  async verifyPassword(pk, password) {
    const user = await this.prisma.user.findUnique({
      select: {
        password: true,
      },
      where: {
        id: pk,
      },
    });
    if (!user || !user.password) {
      sendError("Invalid User Credentials", 401, errorCodes.INVALID_CREDENTIALS);
    }
    if ((await argon.verify(user.password, password)) === false) {
      sendError("Invalid User Credentials", 401, errorCodes.INVALID_CREDENTIALS);
    }

    return true;
  }
}

module.exports = AuthenticationService;
