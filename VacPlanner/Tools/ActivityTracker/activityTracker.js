const repo = require("./repo");
const Log = require("./log");

async function log(message) {
  const log = new Log(message);
  await repo.save(log);
}

module.exports = {
  log,
};
