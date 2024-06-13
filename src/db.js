const { PrismaClient } = require("@prisma/client");

// I have made a change
const prisma = new PrismaClient();

module.exports = { prisma };
