const VacPlannerDb = require("../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../Tools/Connections/VacQueryDbConnection");

module.exports = class VaccinationCenterRepository {
  async availablesVaccinationCenter(reservationDate, zone, state, schedule) {
    try {
      let vaccinationsCentersAvailables =
        await VacPlannerDb.VaccinationCenter.aggregate([
          { $unwind: "$Periods" },
          {
            $match: {
              State: Number(state),
              Zone: Number(zone),
              "Periods.dateFrom": { $lte: reservationDate },
              "Periods.dateTo": { $gte: reservationDate },
              "Periods.availableQuotes": { $gt: 0 },
            },
          },
        ]);
      if (vaccinationsCentersAvailables.length) {
        let vaccinationsCentersWithSchedule =
          vaccinationsCentersAvailables.filter((v) => v.Schedule == schedule);

        if (vaccinationsCentersWithSchedule.length) {
          return vaccinationsCentersWithSchedule;
        } else {
          return vaccinationsCentersAvailables;
        }
      } else {
        return null;
      }
    } catch (ex) {
      throw new Error(`No se puede conectar con la base de datos ${ex}`);
    }
  }

  async decrementQuantityOfQuoteAvailables(vaccinationCenterCode, period) {
    try {
      await VacPlannerDb.VaccinationCenter.findOneAndUpdate(
        { Code: vaccinationCenterCode },
        { $inc: { "Periods.$[el].availableQuotes": -1 } },
        {
          arrayFilters: [
            {
              "el.dateFrom": { $eq: period.dateFrom },
              "el.dateTo": { $eq: period.dateTo },
            },
          ],
        }
      );
      
      return await VacQueryDb.VaccinationCenter.findOneAndUpdate(
        { Code: vaccinationCenterCode },
        { $inc: { "Periods.$[el].availableQuotes": -1 } },
        {
          arrayFilters: [
            {
              "el.dateFrom": { $eq: period.dateFrom },
              "el.dateTo": { $eq: period.dateTo },
            },
          ],
        }
      );
    } catch (ex) {
      throw new Error(`No se puede conectar con la base de datos ${ex}`);
    }
  }
};
