const moment = require("moment");
const {
  VALID_FORMAT_DATE,
  INTERNAL_FORMAT,
} = require("../../../Tools/constants");

const VacPlannerDb = require("../../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../../Tools/Connections/VacQueryDbConnection");
module.exports = class ReserveRepository {
  async get(documentId, vaccinationCode) {
    try {
      return await VacPlannerDb.Reserves.findOne({
        Confirmed: true,
        DocumentId: documentId,
        VaccinationCode: vaccinationCode,
      });
    } catch (ex) {
      throw new Error(
        `No se ha podido establecer conexion con la base de datos ${ex}`
      );
    }
  }

  async getPendingReserves() {
    let response = await VacPlannerDb.Reserves.aggregate([
      { $match: { Confirmed: false } },
      {
        $group: {
          _id: {
            State: "$State",
            Zone: "$Zone",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return response;
  }

  async getPendingReservesToConfirm(state, zone, datePeriod) {
    let response = await VacPlannerDb.Reserves.aggregate([
      {
        $match: {
          Confirmed: false,
          State: state,
          Zone: zone,
          ReservationDate: {
            $gte: datePeriod.dateFrom,
            $lte: datePeriod.dateTo,
          },
        },
      },
    ]);
    return response;
  }

  async updateReserve(reserveCode, vaccinationCode) {
    try {
      await VacPlannerDb.Reserves.findOneAndUpdate(
        { Code: reserveCode },
        { $set: { Confirmed: true, VaccinationCode: vaccinationCode } }
      );

      return await VacQueryDb.Reserves.findOneAndUpdate(
        { Code: reserveCode },
        { $set: { Confirmed: true, VaccinationCode: vaccinationCode } }
      );
    } catch (ex) {
      throw new Error(
        `No se ha podido establecer conexion con la base de datos ${ex}`
      );
    }
  }

  sanitizeDates(date) {
    return moment(date, VALID_FORMAT_DATE, true).format(INTERNAL_FORMAT);
  }
};
