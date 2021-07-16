class AbstractCriteria {
  constructor() {}
  isPersonCompriseInCriteria(reserve, params) {
    throw new Error("No implementado todavia.");
  }

  selectReserveToConfirm(reserves) {
    throw new Error("No implementado todavia.");
  }
}

module.exports = AbstractCriteria;
