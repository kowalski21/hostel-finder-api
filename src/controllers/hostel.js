const router = require("express").Router();
const { prisma } = require("../db");
const asyncHandler = require("../utils/async-handler");
const { sendError, errorCodes } = require("../utils/utils-error");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // console.log(req.query);
    const pageSize = 100;
    const filter = req.query.filter || {};
    const page = req.query.page || 1;

    const totalRecords = await prisma.hostel.count({ where: filter });
    const totalPages = Math.ceil(totalRecords / pageSize);

    const hostels = await prisma.hostel.findMany({
      where: filter,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const meta = {
      page: parseInt(page, 10),
      totalPages,
      total: totalRecords,
    };

    return res.json({ data: hostels, meta: meta });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    payload.ownerId = user.id;
    payload.authorId = user.id;

    const hostel = await prisma.hostel.create({
      data: payload,
    });
    return res.json({ data: hostel, meta: {} });
  })
);

router.get(
  "/:hostelId",
  asyncHandler(async (req, res) => {
    const { hostelId } = req.params;
    const pk = parseInt(hostelId);
    const hostel = await prisma.hostel.findUnique({
      where: {
        id: pk,
      },
    });

    if (!hostel) {
      sendError("Hostel not found", 404, errorCodes.NOT_FOUND);
    }

    return res.json({ data: hostel, meta: {} });
  })
);

//@ list all rooms in a hostel
router.get(
  "/:hostelId/rooms",
  asyncHandler(async (req, res) => {
    const { hostelId } = req.params;
    const pk = parseInt(hostelId);
    const rooms = await prisma.room.findMany({
      where: {
        hostelId: pk,
      },
      orderBy: {
        name: "asc",
      },
    });
    return res.json({ data: rooms, meta: {} });
  })
);

router.patch(
  "/:hostelId",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const { hostelId } = req.params;
    const record = await prisma.hostel.update({
      where: {
        id: parseInt(hostelId),
      },
      data: payload,
    });

    return res.json({ data: record, meta: {} });
  })
);

module.exports = router;
