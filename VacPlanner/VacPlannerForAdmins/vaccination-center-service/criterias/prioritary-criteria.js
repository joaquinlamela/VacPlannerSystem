const AbstractCriteria = require("./abstract-criteria");
class PrioritaryCriteria extends AbstractCriteria {
  constructor() {
    super();
  }

  isPersonCompriseInCriteria(reserve, params) {
    return (params.minCategory <= reserve.Priority && params.maxCategory >= reserve.Priority);
  }

  selectReserveToConfirm(reserves) {
    return reserves.sort((reserve1, reserve2) => reserve1.Priority - reserve2.Priority);
  }
}

module.exports = PrioritaryCriteria;
