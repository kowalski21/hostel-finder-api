const asyncHandler = require("../utils/async-handler");
const _ = require("lodash");
const UserService = require("../services/user");
const { sendError, errorCodes } = require("../utils/utils-error");
const router = require("express").Router();

// get users

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userService = new UserService();

    const { filter = {}, page = 1, pageSize = 2 } = req.query;
    const { data, meta } = await userService.readByQuery(filter, page, pageSize);

    const sanitizedUsers = data.map((user) => _.omit(user, ["password"]));
    return res.json({ data: sanitizedUsers, meta: meta });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const userService = new UserService();
    const payload = req.body;
    // console.log(payload);

    const user = await userService.create(payload);
    // console.log(user);
    if (!user) {
      sendError("User already exists", 400, errorCodes.PAYLOAD);
    }
    const _user = _.omit(user, ["password"]);
    return res.json(_user);
    // return res.json({ message: "users" });
  })
);

router.patch(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userService = new UserService();
    const payload = req.body;
    // console.log(req.params);
    const { userId } = req.params;
    const pk = parseInt(userId);

    const user = await userService.readOne(pk, payload);

    return res.json(user);
  })
);

module.exports = router;
