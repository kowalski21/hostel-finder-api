// flydrive-config.js
const { StorageManager } = require("@slynova/flydrive");

const storage = new StorageManager({
  default: "local",
  disks: {
    local: {
      driver: "local",
      config: {
        root: process.cwd(),
      },
    },
  },
});

module.exports = storage;
