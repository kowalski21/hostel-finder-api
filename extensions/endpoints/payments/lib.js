const { create } = require("apisauce");
const dotenv = require("dotenv");
dotenv.config();
exports.devClient = create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  },
});
