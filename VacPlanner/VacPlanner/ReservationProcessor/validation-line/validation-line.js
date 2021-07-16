function deferBinding() {
  let type = "direct";
  let implementation;
  try {
    implementation = require(`./${type}-line`);
  } catch (err) {
    implementation = require("./direct-line");
  }
  return implementation;
}

module.exports = deferBinding();
