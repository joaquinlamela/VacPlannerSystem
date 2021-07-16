const fs = require("fs");
module.exports = class subscriberRepository {
  constructor() {}

  get() {
    let rawdata = fs.readFileSync(
      "./../VacPlannerForAdmins/configurator/config/clients.json"
    );
    let obj = JSON.parse(rawdata);
    return obj["clients"];
  }
};
