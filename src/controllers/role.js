const router = require("express").Router();
const RoleService = require("../services/role");
const asyncHandler = require("../utils/async-handler");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const service = new RoleService();
    const roles = await service.readByQuery();
    return res.json(roles);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const service = new RoleService();
    const payload = req.body;

    const role = await service.create(payload);
    return res.json(role);
  })
);

router.get(
  "/:roleId",
  asyncHandler(async (req, res) => {
    const { roleId } = req.params;
    // const payload = req.body;
    const pk = parseInt(roleId);
    const service = new RoleService();
    const role = await service.readOne(pk);
    return res.json(role);
  })
);

router.patch(
  "/:roleId",
  asyncHandler(async (req, res) => {
    const { roleId } = req.params;
    const payload = req.body;
    const pk = parseInt(roleId);
    const service = new RoleService();
    const role = await service.updateOne(pk, payload);
    return res.json(role);
  })
);

module.exports = router;
