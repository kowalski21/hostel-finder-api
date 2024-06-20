const traverseAndConvert = (obj) => {
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      // Handle arrays by traversing each element
      obj[key] = obj[key].map(traverseAndConvert);
    } else if (typeof obj[key] === "object") {
      // Recursively traverse nested objects
      traverseAndConvert(obj[key]);
    } else if (typeof obj[key] === "string" && !isNaN(obj[key])) {
      // Convert string to number if it's a valid number
      obj[key] = Number(obj[key]);
    }
  }
  return obj;
};

module.exports = { fixQuery: traverseAndConvert };
