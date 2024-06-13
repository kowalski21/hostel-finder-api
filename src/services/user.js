const { prisma } = require("../db");
const _ = require("lodash");
const { sendError, errorCodes } = require("../utils/utils-error");
const AuthenticationService = require("./authorization");
const argon = require("argon2");
class UserService {
  constructor() {
    this.prisma = prisma;
    this.authenticationService = new AuthenticationService();
  }

  async checkUserName(username) {
    const user = await this.prisma.user.findFirstOrThrow({
      select: { id: true, username: true },
      where: {
        username: username,
      },
    });
  }

  async getUserByUsername(username) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // if (!user) {
    //   sendError("User does not exist", 404, errorCodes.NOT_FOUND);
    // }
    return user;
  }

  async create(payload) {
    const user = await this.getUserByUsername(payload.username);
    // await this.authenticationService.verifyPassword(user.id, payload.password);
    payload.password = await argon.hash(payload.password);
    const newUser = await this.prisma.user.create({ data: payload });
    return newUser;
  }

  async readByQuery(filterQuery = {}, page = 1, pageSize = 5) {
    const totalRecords = await this.prisma.user.count({ where: filterQuery });
    const totalPages = Math.ceil(totalRecords / pageSize);

    const users = await this.prisma.user.findMany({
      where: filterQuery,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const meta = {
      page: parseInt(page, 10),
      totalPages,
    };

    return { data: users, meta: meta };
  }

  async update(pk, payload) {
    if (payload.hasOwnProperty("password")) {
      payload.password = await argon.hash(payload.password);
    }

    try {
      const user = await this.prisma.user.update({
        where: {
          id: pk,
        },
        data: payload,
      });
      return user;
    } catch (error) {
      sendError(error.message, 400, errorCodes.PAYLOAD);
    }
  }

  async readOne(pk, payload) {
    const user = await this.prisma.user.update({
      where: {
        id: pk,
      },
      data: payload,
    });

    const _user = _.omit(user, ["password"]);
    return _user;
  }
}

module.exports = UserService;