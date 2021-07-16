const VaccinationCenterRepository = require("../repositories/vaccination-center-repository");
const ReserveRepository = require("../repositories/reserve-repository");
const moment = require("moment");

const Criteria = require("../criterias/criteria");
const { FORMATS_DATE, VALID_FORMAT_DATE } = require("../../../Tools/constants");
const Params = require("../../configurator/config/parameters-filter.json");

module.exports = class VaccinationCenterService {
  constructor() {
    this.vaccinationCenterRepository = new VaccinationCenterRepository();
    this.reserveRepository = new ReserveRepository();
  }

  async save(vaccinationCenter) {
    await this.validateVaccinationData(vaccinationCenter);
    return await this.vaccinationCenterRepository.save(vaccinationCenter);
  }

  async listPendingReserves() {
    return await this.reserveRepository.getPendingReserves();
  }

  async validateVaccinationData(vaccinationCenter) {
    let validationError = new Error();
    validationError.type = "validation";
    if (!this.isFieldsCompleted(vaccinationCenter)) {
      validationError.message = "Todos los campos son obligatorios.";
      throw validationError;
    }
    if (!this.isStateCorrect(vaccinationCenter.State)) {
      validationError.message = `El estado del vacunatorio debe estar entre ${Params.State.minValue} y ${Params.State.maxValue}.`;
      throw validationError;
    }
    if (!this.isZoneCorrect(vaccinationCenter.Zone)) {
      validationError.message = `La zona del vacunatorio debe estar entre ${Params.Zone.minValue} y ${Params.Zone.maxValue}.`;
      throw validationError;
    }
    if (!this.isScheduleCorrect(vaccinationCenter.Schedule)) {
      validationError.message = `El horario del vacunatorio debe estar entre ${Params.Schedule.minValue} y ${Params.Schedule.maxValue}`;
      throw validationError;
    }

    if (await this.isExistingCode(vaccinationCenter.Code)) {
      validationError.message =
        "Ya existe un vacunatorio con el codigo ingresado.";
      throw validationError;
    }
  }

  async addPeriod(dataForNewQuotes) {
    let { Code, Periods } = dataForNewQuotes;

    await this.validatePeriodData(dataForNewQuotes);

    await this.confirmPendingReserves(dataForNewQuotes);

    Periods = Periods.filter((p) => p.quotes > 0);
    if (Periods.length) {
      const response = await this.vaccinationCenterRepository.addPeriods(
        Code,
        Periods
      );
      if (response)
        return {
          message: `Periodos agregados correctamente al vacunatorio: ${Code}.`,
        };

      throw Error(`No se ha encontrado un vacunatorio con el codigo ${Code}.`);
    } else {
      return {
        message: `Periodos agregados correctamente al vacunatorio: ${Code}.`,
      };
    }
  }

  async addVaccinationAct(vaccinationAct) {
    const { DocumentId, VaccinationCode, VaccinationDate } = vaccinationAct;

    if (await this.personHasReservation(DocumentId, VaccinationCode)) {
      vaccinationAct.VaccinationDate = this.sanitizeDates(VaccinationDate);
      return await this.vaccinationCenterRepository.addVaccinationAct(
        vaccinationAct
      );
    } else {
      const validationError = new Error(
        `La persona con Cedula: ${DocumentId} no tiene reserva en el vacunatorio ${VaccinationCode}.`
      );
      validationError.type = "validation";
      throw validationError;
    }
  }

  async searchVaccines(vaccinator, date) {
    if (await this.isExistingCode(vaccinator)) {
      date = this.sanitizeDates(date);
      return this.vaccinationCenterRepository.getVaccines(vaccinator, date);
    } else {
      let error = new Error(
        `No se ha encontrado un vacunatorio con el codigo ${vaccinator}`
      );
      error.type = "not-found";
      throw error;
    }
  }

  async listPendingReserves() {
    return await this.reserveRepository.getPendingReserves();
  }

  async personHasReservation(documentId, vaccinationCode) {
    return await this.reserveRepository.get(documentId, vaccinationCode);
  }

  isFieldsCompleted(vaccinationCenterData) {
    return (
      vaccinationCenterData &&
      vaccinationCenterData.hasOwnProperty("State") &&
      vaccinationCenterData.hasOwnProperty("Zone") &&
      vaccinationCenterData.hasOwnProperty("Name") &&
      vaccinationCenterData.hasOwnProperty("Schedule") &&
      vaccinationCenterData.hasOwnProperty("Code")
    );
  }

  isStateCorrect(state) {
    return state >= Params.State.minValue && state <= Params.State.maxValue;
  }

  isZoneCorrect(zone) {
    return zone >= Params.Zone.minValue && zone <= Params.Zone.maxValue;
  }

  isScheduleCorrect(schedule) {
    return (
      schedule >= Params.Schedule.minValue &&
      schedule <= Params.Schedule.maxValue
    );
  }

  async isExistingCode(code) {
    return await this.vaccinationCenterRepository.get(code);
  }

  async validatePeriodData(data) {
    const { Code, State, Zone } = data;
    let vaccinationCenter = await this.vaccinationCenterRepository.get(Code);

    if (
      !vaccinationCenter ||
      vaccinationCenter.State !== State ||
      vaccinationCenter.Zone !== Zone
    ) {
      const validationError = new Error(
        "El codigo de vacunatorio no es valido para el estado y zona ingresada."
      );
      validationError.type = "validation";
      throw validationError;
    }
  }

  async confirmPendingReserves(vaccinationCenterData) {
    for (let period of vaccinationCenterData.Periods) {
      period.dateFrom = this.sanitizeDates(period.dateFrom);
      period.dateTo = this.sanitizeDates(period.dateTo);
      const confirmedReserves = await this.updatePendingReserves(
        vaccinationCenterData,
        period
      );
      period.quotes = period.quotes - confirmedReserves.length;
    }
  }

  async updatePendingReserves(vaccinationCenterData, period) {
    let { Code, State, Zone } = vaccinationCenterData;
    let reservesToConfirm =
      await this.reserveRepository.getPendingReservesToConfirm(
        State,
        Zone,
        period
      );

    let criteriaOfVaccinationCenter = new (Criteria(period.criteria.name))();

    var reservesForTheCriteria = [];

    for (let reserve of reservesToConfirm) {
      if (
        criteriaOfVaccinationCenter.isPersonCompriseInCriteria(
          reserve,
          period.criteria.params
        )
      ) {
        reservesForTheCriteria.push(reserve);
      }
    }

    let reservesSelectedToConfirm = criteriaOfVaccinationCenter
      .selectReserveToConfirm(reservesForTheCriteria)
      .slice(0, period.quotes);

    for (let reserve of reservesSelectedToConfirm) {
      await this.reserveRepository.updateReserve(reserve.Code, Code);
    }

    return reservesSelectedToConfirm;
  }

  sanitizeDates(date) {
    return moment(date, FORMATS_DATE, true).format(VALID_FORMAT_DATE);
  }
};
