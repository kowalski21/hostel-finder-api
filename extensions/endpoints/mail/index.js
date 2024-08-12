const register = (router, { services, exceptions, database, getSchema }) => {
  const { MailService } = services;
  //   console.log(Object.keys(exceptions));
  //   console.log(Object.keys(database));
  //   console.log(Object.keys(services));
  const { InvalidQueryException } = exceptions;
  router.get(`/new`, async (req, res, next) => {
    const schema = await getSchema();
    const mailService = new MailService({ schema });
    await mailService.send({
      to: "douglasbiomed3@gmail.com",
      from: "noreply@directus.io",
      subject: "Testiing Email",
      text: `Hope it works`,
    });
    return res.json({ message: "mail sent" });
  });
};

module.exports = register;
