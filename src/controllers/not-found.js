const RouteNotFoundException = require("../exceptions/route-not-found");
const notFound = async (req, res, next) => {
  try {
    next(new RouteNotFoundException(req.path));
  } catch (err) {
    next(err);
  }
};

module.exports = notFound;
