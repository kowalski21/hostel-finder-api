const router = require("express").Router();
const { prisma } = require("../db");
const asyncHandler = require("../utils/async-handler");
const { sendError, errorCodes } = require("../utils/utils-error");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // console.log(req.query);
    const pageSize = 2;
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
    return res.json({ message: "hostel created", hostel });
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

    return res.json(hostel);
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
    });
    return res.json({ message: "Hostel details", rooms });
  })
);

router.patch(
  "/:hostelId",
  asyncHandler(async (req, res) => {
    const { hostelId } = req.params;

    return res.json({ message: "Hostel details" });
  })
);

module.exports = router;
