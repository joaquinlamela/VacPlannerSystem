const AbstractCriteria = require("./abstract-criteria");
const moment = require("moment");

class EtaryCriteria extends AbstractCriteria {
  constructor() {
    super();
  }

  isPersonCompriseInCriteria(reserve, params) {
    var ageOfPerson = moment().diff(reserve.DateOfBirth, "years");
    return params.minAge <= ageOfPerson && params.maxAge >= ageOfPerson;
  }

  selectReserveToConfirm(reserves) {
    return reserves.sort(
      (reserve1, reserve2) =>
        new Date(reserve1.DateOfBirth) - new Date(reserve2.DateOfBirth)
    );
  }
}

module.exports = EtaryCriteria;
