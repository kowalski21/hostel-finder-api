const { createServer } = require("./server");

const startServer = async () => {
  const server = await createServer();
  const port = process.env.PORT;

  server
    .listen(port, () => {
      console.log(`Server has started on port ${port}`);
    })
    .once("error", (err) => {
      if (err?.code === "EADDRINUSE") {
        logger.fatal(`Port ${port} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
};

// startServer().catch((err) => {
//   console.log(err);
// });

startServer()
  .then(() => {
    console.log(`Server is running`);
  })
  .catch((err) => {
    console.log(err);
  });
