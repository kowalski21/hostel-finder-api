const asyncHandler = require("../utils/async-handler");
const _ = require("lodash");
const UserService = require("../services/user");
const { sendError, errorCodes } = require("../utils/utils-error");
const router = require("express").Router();
const qs = require("qs");
const joi = require("joi");
const InvalidPayloadException = require("../exceptions/invalid-payload");

const createUserSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  avatar: joi.string(),
  roleId: joi.number(),
});

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userService = new UserService();
    // console.log(req.query);

    let { filter = {}, page = 1, pageSize = 20 } = req.query;
    // console.log(traverseAndConvert(filter));
    pageSize = parseInt(pageSize);
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
    console.log(payload);
    const { error, value } = createUserSchema.validate(req.body);
    if (error) throw new InvalidPayloadException(error.message);

    const user = await userService.create(payload);
    // console.log(user);
    if (!user) {
      sendError("User already exists", 400, errorCodes.PAYLOAD);
    }
    const _user = _.omit(user, ["password"]);
    return res.json({ data: _user, meta: {} });
    // return res.json({ message: "users" });
  })
);

router.patch(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userService = new UserService();
    const _payload = req.body;
    const payload = _.omit(_payload, _.isNull);
    // console.log(req.params);
    const { userId } = req.params;
    const pk = parseInt(userId);

    const user = await userService.updateOne(pk, payload);

    return res.json({ data: user, meta: {} });
  })
);

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const userService = new UserService();
    const { userId } = req.params;
    const pk = parseInt(userId);

    const user = await userService.readOne(pk);

    return res.json({ data: user, meta: {} });
  })
);

module.exports = router;
