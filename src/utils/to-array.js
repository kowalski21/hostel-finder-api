exports.toArray = (val) => {
  if (typeof val === String) {
    return val.split(",");
  }

  return Array.isArray(val) ? val : [val];
};
