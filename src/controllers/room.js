const router = require("express").Router();
const asyncHandler = require("../utils/async-handler");
const { prisma } = require("../db");
router.get(
  "/",
  asyncHandler(async (req, res) => {
    return res.json({ data: [] });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = req.body;

    const room = await prisma.room.create({
      data: payload,
    });

    return res.json({ message: "room created", room });
  })
);

router.get(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    return res.json({ message: "Room details" });
  })
);

router.patch(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    return res.json({ message: "Room details" });
  })
);

module.exports = router;
