const router = require("express").Router();
const joi = require("joi");
const _ = require("lodash");
const asyncHandler = require("../utils/async-handler");
const InvalidPayloadException = require("../exceptions/invalid-payload");
const AuthenticationService = require("../services/authorization");
const { isLoggedIn } = require("../middleware/perms");
const loginSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

router.post(
  "/login",

  asyncHandler(async (req, res, next) => {
    // throw new Error("oops");
    const service = new AuthenticationService();
    const accountability = {
      ip: req.ip,
      userAgent: req.get("user-agent"),
      role: null,
    };

    const { error, value } = loginSchema.validate(req.body);
    if (error) throw new InvalidPayloadException(error.message);

    const data = await service.authenticate(value.username, value.password);

    return res.json(data);
  })
);

router.get(
  "/me",
  isLoggedIn,
  asyncHandler(async (req, res) => {
    const service = new AuthenticationService();
    const _user = req.user;
    const user = await service.prisma.user.findUnique({
      where: {
        id: _user.id,
      },
      include: {
        role: true,
      },
    });

    const omit_ = _.omit(user, ["password"]);

    return res.json({ data: omit_, meta: [] });
  })
);

module.exports = router;
