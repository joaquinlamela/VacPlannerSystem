const moment = require("moment");
const RequestChecker = require("../ReservationProcessor/requestChecker");
const ExistencyService = require("../ReservationProcessor/services/existency-service");
const ReservationRepository = require("../repositories/reservation-repository");
const QueueService = require("../repositories/to-emmiter-queue");
const VaccinationCenterRepository = require("../repositories/vaccination-center-repository");
const Criteria = require("../../VacPlannerForAdmins/vaccination-center-service/criterias/criteria");

const config = require("../../VacPlannerForAdmins/configurator/config/parameters-filter.json")
const VALID_FORMAT_DATE = "YYYY-MM-DDThh:mm:ssZ";

module.exports = class ReservationService {
  constructor() {
    this.requestChecker = new RequestChecker();
    this.existencyService = new ExistencyService();
    this.reservationRepository = new ReservationRepository();
    this.emmiterQueue = new QueueService();
    this.vacCenterRepository = new VaccinationCenterRepository();
  }

  async saveReserve(reserve) {
    let result = await this.requestChecker.checkClientConditions(reserve);
    if (result.error) {
      let validationError = new Error(result.error);
      validationError.type = "validation";
      throw validationError;
    }

    const idProviderData = await this.existencyService.isValidIdentity(reserve.DocumentId)
      .catch(ex => {throw ex;});

    const existingReservation = await this.reservationRepository.get(reserve.DocumentId);

    if (!existingReservation) 
      return this.createNewReserve(reserve, idProviderData);
      
    let validationError = new Error(`${reserve.DocumentId} ya tiene una reserva con codigo ${existingReservation.Code} en el sistema.`);
    validationError.type = "validation";
    throw validationError;
  }

  async getReserve(documentId) {
    const reserve = await this.reservationRepository.get(documentId);
    return reserve;
  }

  async deleteReserve(documentId, reserveCode) {
    const reserve = await this.reservationRepository.delete(
      documentId,
      reserveCode
    );
    if (reserve)
      this.emmiterQueue.enqueue("cancellations", { reserveCode, documentId });

    return reserve;
  }

  async createNewReserve(reserve, idProviderData){
    reserve.Code = new Date().valueOf();
    reserve.DateOfBirth = idProviderData.DateOfBirth;
    reserve.Priority = idProviderData.Priority;
    reserve.Confirmed = false;
    const vaccinationCenters = await this.searchAvailableVacCenters(reserve);

    if (vaccinationCenters) {
      for (let i = 0; i < vaccinationCenters.length && !reserve.Confirmed; i++) {
        let period = vaccinationCenters[i].Periods;
        let criteriaOfVaccinationCenter = new (Criteria(period.criteria.name))();

        if (criteriaOfVaccinationCenter.isPersonCompriseInCriteria(reserve,period.criteria.params)) {
          await this.vacCenterRepository.decrementQuantityOfQuoteAvailables(vaccinationCenters[i].Code,period);
          reserve.Confirmed = true;
          reserve.VaccinationCode = vaccinationCenters[i].Code;
        }
      }
    }

    this.emmiterQueue.enqueue("newReserves", reserve);

    return reserve;
  }

  async searchAvailableVacCenters(reserve) {
    const {ReservationDate, Schedule, State, Zone} = reserve;
    return await this.vacCenterRepository.availablesVaccinationCenter(
      this.sanitizeDates(ReservationDate),Zone,State,Schedule);
  }

  sanitizeDates(date) {
    return moment(date, config.ReservationDate.internalFormat, true).format(VALID_FORMAT_DATE);
  }
};
