const { PrismaClient } = require("@prisma/client");

// I have made a change to this file 
const prisma = new PrismaClient();

module.exports = { prisma };
