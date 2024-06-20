const router = require("express").Router();
const asyncHandler = require("../utils/async-handler");
const { prisma } = require("../db");
const { formatDt, currentYear } = require("../utils/date");
const { sendError, errorCodes } = require("../utils/utils-error");
// const { pullAll } = require("lodash");
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const rooms = await prisma.room.findMany();
    return res.json({ data: rooms, meta: {} });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body;

    const room = await prisma.room.create({
      data: payload,
    });

    return res.json({ data: room, meta: {} });
  })
);

router.post(
  "/assign",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const authUser = req.user;
    // console.log(authUser);
    payload.userId = authUser.id;
    payload.startDate = formatDt(payload.startDate);
    payload.year = currentYear();
    // console.log(payload);
    const assigned_room = await prisma.roomOccupancy.create({
      data: payload,
    });
    return res.json({ data: assigned_room, meta: {} });
  })
);

router.get(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const pk = parseInt(roomId);
    const room = await prisma.room.findUnique({
      where: {
        id: pk,
      },
      include: {
        room_request: true,
        occupants: true,
      },
    });

    return res.json({ data: room, meta: {} });
  })
);

router.patch(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    return res.json({ data: {}, meta: {} });
  })
);

// update room assignment
router.get(
  "/:roomId/occupants",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const pk = parseInt(roomId);
    const tenants = await prisma.roomOccupancy.findMany({
      where: {
        roomId: pk,
      },
      include: {
        room: true,
      },
    });
    return res.json({ data: tenants, meta: {} });
  })
);

// view room occupant info
router.patch(
  "/:roomId/occupants/:occupantId",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const { roomId, occupantId } = req.params;
    const roomPk = parseInt(roomId);
    const occupantPk = parseInt(occupantId);

    const tenant = await prisma.roomOccupancy.update({
      where: {
        id: occupantPk,
      },
      data: payload,
    });
    if (!tenant) {
      sendError("Occupant does not exist", 404, errorCodes.NOT_FOUND);
    }
    return res.json({ data: tenant, meta: {} });
  })
);

router.get(
  "/:roomId/occupants/:occupantId",
  asyncHandler(async (req, res) => {
    const { roomId, occupantId } = req.params;
    const roomPk = parseInt(roomId);
    const occupantPk = parseInt(occupantId);

    const tenant = await prisma.roomOccupancy.findUnique({
      where: {
        id: occupantPk,
        roomId: roomPk,
      },
    });
    if (!tenant) {
      sendError("Occupant does not exist", 404, errorCodes.NOT_FOUND);
    }
    return res.json({ data: tenant, meta: {} });
  })
);
// router.get()
module.exports = router;
