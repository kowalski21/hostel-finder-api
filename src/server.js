const http = require("http");
const { createApp } = require("./app");
const createServer = async () => {
  const server = http.createServer(await createApp());
  // console.log(`I have created a server`);

  return server;
};

module.exports = { createServer };
