const ReserveRepository = require("../repository/reserve-repository");
const VaccinationCenterRepository = require("../repository/vaccination-center-repository");

module.exports = class QueryService {
  constructor() {
    this.reserveRepository = new ReserveRepository();
    this.vaccinationCenterRepository = new VaccinationCenterRepository();
  }

  async listPendingReserves() {
    return await this.reserveRepository.getPendingReservesByState();
  }

  async listAppliedVaccines(params) {
    this.validateParameters(params);

    const { dateFrom, dateTo, ageFrom, ageTo } = params;
    if (ageFrom && ageTo) {
      return await this.vaccinationCenterRepository.getAppliedVaccinesByDateAge(
        dateFrom,
        dateTo,
        ageFrom,
        ageTo
      );
    } else {
      return await this.vaccinationCenterRepository.getAppliedVaccinesByDate(
        dateFrom,
        dateTo
      );
    }
  }

  validateParameters(params) {
    if (params.dateFrom === undefined || params.dateTo === undefined) {
      let validationError = new Error(
        "Parametros invalidos, necesita proveer al menos fecha-desde y fecha-hasta."
      );
      validationError.type = "validation";
      throw validationError;
    }

    if (
      (params.ageFrom !== undefined && params.ageTo === undefined) ||
      (params.ageFrom === undefined && params.ageTo !== undefined)
    ) {
      let validationError = new Error(
        "Parametros invalidos, necesita proveer edad-desde y edad-hasta."
      );
      validationError.type = "validation";
      throw validationError;
    }
  }
};
