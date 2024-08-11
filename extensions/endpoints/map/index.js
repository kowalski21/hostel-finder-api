const { hostelDistanceSql } = require("./sql/hostel_distance");

const register = (router, { services, exceptions, database }) => {
  //   console.log(Object.keys(exceptions));
  //   console.log(Object.keys(database));
  const { InvalidQueryException } = exceptions;
  router.get(`/search`, async (req, res, next) => {
    const { lat, lng } = req.query;
    if (!lat && !lng) {
      const hostels = await database.from("hostel").select("*");
      // console.log(hostels);
      return res.json({ data: hostels });
      // return next(new InvalidQueryException("Provide Longitude and Lattitude"));
    }
    // console.log({ lat, lng });
    let payload = { lat: Number(lat), lng: Number(lng) };
    // console.log(payload);
    // console.log(hostelDistanceSql);
    try {
      const result = await database.raw(hostelDistanceSql, [payload.lat, payload.lng, 10000]);
      return res.json({ data: result.rows });
    } catch (error) {
      return next(InvalidQueryException("Error query database,check logs"));
    }
  });
};

module.exports = register;
