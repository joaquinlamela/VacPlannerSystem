module.exports = function deferBinding(criteriaName) {
  let implementation;
  try {
    implementation = require(`./${criteriaName}-criteria`);
  } catch (err) {
    implementation = require("./etary-criteria");
  }
  return implementation;
};
