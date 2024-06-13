const express = require("express");
const cors = require("cors");
const qs = require("qs");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error-handler");
const InvalidPayloadException = require("./exceptions/invalid-payload");
const morgan = require("morgan");
const notFound = require("./controllers/not-found");

dotenv.config();

const createApp = async () => {
  //  validate secret
  //  validate database connection

  const app = express();

  app.use(morgan("dev"));
  app.use(cors());

  app.disabled("x-powered-by");
  app.set("trust proxy", true);
  app.use((req, res, next) => {
    express.json()(req, res, (err) => {
      if (err) {
        return next(new InvalidPayloadException(err.message));
      }

      return next();
    });
  });

  app.use(express.json());

  //   register routes
  app.get("/health", (req, res) => {
    return res.json({ message: "Server is healthy" });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = {
  createApp,
};
