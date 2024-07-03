const BaseException = require("./base");

class RouteNotFoundException extends BaseException {
  constructor(path) {
    super(`Error Route ${path} does not exist`, 404, `ROUTE_NOT_FOUND`);
  }
}

module.exports = RouteNotFoundException;
