const { prisma } = require("../db");
const asyncHandler = require("../utils/async-handler");
const { currentYear } = require("../utils/date");
const { sendError, errorCodes } = require("../utils/utils-error");

const router = require("express").Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const roomRequests = await prisma.roomRequest.findMany({});
    return res.json({ data: roomRequests, meta: {} });
  })
);

// make a room requests
// check if same status of has been made

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const found = await prisma.roomRequest.findMany({
      where: {
        AND: [
          {
            status: {
              in: ["active", "draft"],
            },
          },
          {
            customerId: req.user.id,
          },
          {
            roomId: payload.roomId,
          },
        ],
      },
    });

    if (found) {
      sendError("Room Request has been issued", 400, errorCodes.PAYLOAD);
    }
    // console.log(payload);
    payload.year = currentYear();
    payload.customerId = req.user.id;
    const room_request = await prisma.roomRequest.create({
      data: payload,
    });
    return res.json({ data: room_request, meta: {} });
  })
);

//  view request details
router.get(
  "/:room_request",
  asyncHandler(async (req, res) => {
    const { room_request } = req.params;
    const record = await prisma.roomRequest.findUnique({
      where: {
        id: parseInt(room_request),
      },
    });
    return res.json({ data: record, meta: {} });
  })
);

router.patch(
  "/:room_request",
  asyncHandler(async (req, res) => {
    const payload = req.body;
    const { room_request } = req.params;
    const record = await prisma.roomRequest.update({
      where: {
        id: parseInt(room_request),
      },
      data: payload,
    });

    return res.json({ data: record, meta: {} });
  })
);

module.exports = router;
