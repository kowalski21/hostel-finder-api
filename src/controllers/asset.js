const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const asyncHandler = require("../utils/async-handler");
const fs = require("fs");
const { sendError, errorCodes } = require("../utils/utils-error");
// const storage = require("../storage");

// const upload = multer({ dest: "./uploads" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req);
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // console.log(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    // console.log("ooops");
    try {
      const file = req.file;
      if (!file) {
        sendError("File not present", 400, errorCodes.PAYLOAD);
      }

      const filePath = path.join("uploads", file.filename);
      return res.json({ message: "done", url: file.filename });
      //   fs.unlinkSync(file.path);
      // return res.json({ message: "File uploaded", url: file.filename });
    } catch (error) {
      console.log(error);
      sendError("File Upload Failed..", 500, errorCodes.PAYLOAD);
    }
  })
);

router.get("/:assetId", async (req, res) => {
  try {
    const filename = req.params.assetId;
    const filePath = path.join("uploads", filename);

    // console.log("File Path", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found.");
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    res.status(500).send({ message: "File retrieval failed", error: error.message });
  }
});

module.exports = router;
