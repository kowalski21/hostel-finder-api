const registerHook = ({ init, filter, action }, hookCtx) => {
  const { logger, env, database, emitter, services, exceptions, getSchema } = hookCtx;
  const { ItemsService } = services;
  //   console.log(Object.keys(services));
  const { InvalidPayloadException } = exceptions;
  //   console.log(Object.keys(exceptions));
  filter("room_request.items.create", async (input, ctx, opt) => {
    const service = new ItemsService("room_request", { schema: opt.schema });
    // console.log(Object.keys(ctx));
    // console.log(Object.keys(input));
    // console.log(Object.keys(opt));
    // check hotel requests - for customer
    const items = await service.readByQuery({
      fields: ["*"],
      filter: {
        _and: [
          {
            customer: input.customer,
          },
          {
            status: {
              _in: ["published", "paid", "draft"],
            },
          },
          {
            room: input.room,
          },
        ],
      },
    });
    // console.log(items);
    if (items.length > 0) {
      //   console.log(items);
      throw new InvalidPayloadException("You have booked this room already, check your dashboard");
    }

    // console.log(input);
    // console.log(Object.keys(ctx));
    // throw new Error("oops");
  });

  action("payment.items.create", async ({ payload }, { database: knex }) => {
    // console.log(Object.keys(ctx));
    knex("room")
      .where("id", payload.room)
      .increment("tenant_no", 1)
      .then(() => {
        console.log("Increment has been done");
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(payload);
  });
};

module.exports = registerHook;
