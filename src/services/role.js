const { prisma } = require("../db");
const { sendError, errorCodes } = require("../utils/utils-error");

class RoleService {
  constructor() {
    this.prisma = prisma;
  }

  async create(payload) {
    const role = await this.prisma.role.create({ data: payload });
    return role;
  }

  async readByQuery(filterQuery = {}, page = 1, pageSize = 5) {
    const totalRecords = await this.prisma.role.count({ where: filterQuery });
    const totalPages = Math.ceil(totalRecords / pageSize);

    const roles = await this.prisma.role.findMany({
      where: filterQuery,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const meta = {
      page: parseInt(page, 10),
      totalPages,
    };

    return { data: roles, meta: meta };
  }

  async readOne(id) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });

    if (!role) {
      sendError("Role not found", 404, errorCodes.NOT_FOUND);
    }

    return role;
  }

  async updateOne(id, payload) {
    const role = await this.prisma.role.update({
      where: {
        id: id,
      },
      data: payload,
    });

    return role;
  }
}

module.exports = RoleService;
