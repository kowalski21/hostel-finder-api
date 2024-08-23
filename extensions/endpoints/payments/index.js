const crypto = require("crypto");
const { devClient } = require("./lib");

const register = (router, { services, exceptions, database, getSchema, env }) => {
  const { MailService, ItemsService } = services;
  //   console.log(env);
  //   console.log(Object.keys(exceptions));
  //   console.log(Object.keys(database));
  //   console.log(Object.keys(services));
  const { InvalidQueryException, InvalidPayloadException } = exceptions;
  router.post(`/initiate`, async (req, res, next) => {
    const payload = req.body;

    const response = await devClient.post(`/transaction/initialize`, payload);
    if (!response.ok) {
      console.log(response.data);
      throw new InvalidPayloadException(`Error initializing payment`);
    }
    // console.log(response.data);
    // intiate the transaction and returns the checkout url
    // const schema = await getSchema();

    // const mailService = new MailService({ schema });

    return res.json(response.data);
  });

  // test implementation when payment is done
  router.post(`/verify`, async (req, res) => {
    const schema = await getSchema();
    // console.log(schema);
    const paymentService = new ItemsService("payment", { schema });
    const requestService = new ItemsService("room_request", { schema });
    const tenantService = new ItemsService("tenant", { schema });

    const roomRequest = await requestService.readOne(16);

    // get the request information

    // console.log(roomRequest);
    // create payment object for the room request
    let paymentPayload = {
      status: "published",
      customer: roomRequest.customer,
      room: roomRequest.room,
      amount: roomRequest.room_price,
      payment_type: "momo",
      room_request: roomRequest.id,
      meta: {
        authorization: true,
        data: true,
      },
    };

    console.log(paymentPayload);

    const paymentData = await paymentService.createOne(paymentPayload);

    // console.log(paymentData);

    // tenant payload
    const tenantPayload = {
      hostel: roomRequest.hostel,
      payment: paymentData,
      room: roomRequest.room,
      room_request: roomRequest.id,
      paid_amount: paymentPayload.amount,
      occupant: roomRequest.customer,
      status: "published",
    };

    const tenant = await tenantService.createOne(tenantPayload);
    // console.log(tenant);

    // update the room request

    await requestService.updateOne(roomRequest.id, { paid: true, status: "paid" });

    return res.json({ message: "done" });
  });

  router.post(`/webhook`, async (req, res) => {
    const schema = await getSchema();
    const paymentService = new ItemsService("payment", { schema });
    const requestService = new ItemsService("room_request", { schema });
    const tenantService = new ItemsService("tenant", { schema });
    const hash = crypto.createHmac("sha512", env["PAYSTACK_SECRET_KEY"]).update(JSON.stringify(req.body)).digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const payload = req.body;
      console.log(payload);
      const metadata = payload.data.metadata;
      const roomRequest = await requestService.readOne(metadata.room_request);
      let paymentPayload = {
        status: "published",
        customer: roomRequest.customer,
        room: roomRequest.room,
        amount: roomRequest.room_price,
        payment_type: "momo",
        room_request: roomRequest.id,
        meta: payload.data,
      };
      switch (payload.event) {
        case "charge.success":
          const paymentData = await paymentService.createOne(paymentPayload);
          const tenantPayload = {
            hostel: roomRequest.hostel,
            payment: paymentData,
            room: roomRequest.room,
            room_request: roomRequest.id,
            paid_amount: paymentPayload.amount,
            occupant: roomRequest.customer,
            status: "published",
          };

          const tenant = await tenantService.createOne(tenantPayload);
          await requestService.updateOne(roomRequest.id, { paid: true, status: "paid" });
          // perform some actions  break
          break;
        default:
          console.log(`Error processing payments`);
      }
      // Do something with event
    }

    return res.json({
      message: "payment processed",
    });
  });
};

module.exports = register;
