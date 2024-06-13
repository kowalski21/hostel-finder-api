const http = require("http");
const { createApp } = require("./app");
const createServer = async () => {
  const server = http.createServer(await createApp());

  return server;
};

module.exports = { createServer };
