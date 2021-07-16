const ValidationLine = require("./validation-line/validation-line");
var glob = require("glob");
const fs = require("fs");
var parameters;

module.exports = class RequestChecker {
  constructor() {
    this.validationLine = new ValidationLine();
    this.chargeParameters();
    this.getFilters();
  }

  async checkClientConditions(reserve) {
    return this.validationLine.run(reserve);
  }

  getFilters() {
    glob.sync("./ReservationProcessor/filters/*.js").forEach((file) => {
      let location = file.split("/");
      if (location.length === 4) {
        let extension = location[3].split(".");
        if (extension.length === 2) {
          const filterToUse = require(`./${location[2]}/${extension[0]}`);
          filterToUse.setParameters(parameters);
          this.validationLine.use(filterToUse);
        }
      }
    });
  }

  chargeParameters() {
    let rawdata = fs.readFileSync(
      "./../VacPlannerForAdmins/configurator/config/parameters-filter.json"
    );
    parameters = JSON.parse(rawdata);
  }
};
