const extractToken = (req, _res, next) => {
  let token = null;

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");

    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      token = parts[1];
    }
  }

  req.token = token;
  next();
};

module.exports = { extractToken };
