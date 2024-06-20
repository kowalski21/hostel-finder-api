const { formatISO, parseISO, getYear } = require("date-fns");

exports.formatDt = (dateObj) => {
  const parsedDate = parseISO(dateObj);
  return formatISO(parsedDate, { representation: "complete" });
};

exports.currentYear = () => {
  const currentDate = new Date();

  const year = getYear(currentDate);
  return `${year}`;
};
