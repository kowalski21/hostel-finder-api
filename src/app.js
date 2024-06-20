const express = require("express");
const cors = require("cors");
const qs = require("qs");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error-handler");
const InvalidPayloadException = require("./exceptions/invalid-payload");
const morgan = require("morgan");
const notFound = require("./controllers/not-found");
const path = require("path");
// const storage = require("./storage");

// middlewares

const { extractToken } = require("./middleware/extract-token");

// routers

const authRouter = require("./controllers/auth");
const userRouter = require("./controllers/user");
const roleRouter = require("./controllers/role");
const assetRouter = require("./controllers/asset");
const hostelRouter = require("./controllers/hostel");
const roomsRouter = require("./controllers/room");
const roomRequestRouter = require("./controllers/room_request");
const { authenticateHandler } = require("./middleware/authenticate");
const { isLoggedIn } = require("./middleware/perms");
const { fixQuery } = require("./utils/query");

dotenv.config();
const folderPath = path.join(__dirname, "..", "uploads");
console.log(folderPath);
const createApp = async () => {
  //  validate secret
  //  validate database connection

  const app = express();

  app.use(morgan("dev"));
  app.use(cors());

  app.disabled("x-powered-by");
  app.set("trust proxy", true);
  app.use("query parser", (str) => qs.parse(str, { depth: 10 }));
  app.set("x-powered-by", "Devops Champs");

  // console.log(folderPath);

  // app.use("/uploads", express.static(folderPath));
  app.use((req, res, next) => {
    let query = req.query;
    req.query = fixQuery(query);
    // console.log(req.query);
    return next();
  });
  app.use((req, res, next) => {
    express.json()(req, res, (err) => {
      if (err) {
        return next(new InvalidPayloadException(err.message));
      }

      return next();
    });
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(extractToken);

  app.use(authenticateHandler);

  //   register routes
  app.get("/api/health", (req, res) => {
    // throw new Error("oops");
    // console.log(req.token);
    return res.json({ message: "Server is healthy" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/roles", roleRouter);
  app.use("/api/assets", assetRouter);
  app.use("/api/hostels", isLoggedIn, hostelRouter);
  app.use("/api/rooms", isLoggedIn, roomsRouter);
  app.use("/api/room_request", isLoggedIn, roomRequestRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = {
  createApp,
};
