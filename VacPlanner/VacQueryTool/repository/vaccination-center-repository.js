const MongoService = require("../../Tools/Connections/VacQueryDbConnection");
module.exports = class VaccinationCenterRepository {
  async getAppliedVaccinesByDateAge(dateFrom, dateTo, ageFrom, ageTo) {
    const dateFromIsoString = new Date(dateFrom).toISOString();
    const dateToIsoString = new Date(dateTo).toISOString();

    let response = await MongoService.VaccinationCenter.aggregate([
      { $unwind: "$Periods" },
      { $unwind: "$Periods.criteria" },
      {
        $match: {
          $and: [
            { "Periods.criteria.name": "etary" },
            { "Periods.criteria.params.minAge": { $gte: parseInt(ageFrom) } },
            { "Periods.criteria.params.maxAge": { $lte: parseInt(ageTo) } },
            {
              $or: [
                {
                  "Periods.dateFrom": { $gte: dateFromIsoString },
                  "Periods.dateTo": { $lte: dateToIsoString },
                },
                {
                  "Periods.dateFrom": { $lte: dateToIsoString },
                  "Periods.dateTo": { $gte: dateToIsoString },
                },
                {
                  "Periods.dateFrom": { $lte: dateFromIsoString },
                  "Periods.dateTo": { $gte: dateFromIsoString },
                },
              ],
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            State: "$State",
            Zone: "$Zone",
          },
          appliedVaccines: { $sum: "$Periods.givenDoses" },
        },
      },
    ]);

    return response;
  }

  async getAppliedVaccinesByDate(dateFrom, dateTo) {
    const dateFromIsoString = new Date(dateFrom).toISOString();
    const dateToIsoString = new Date(dateTo).toISOString();

    let response = await MongoService.VaccinationCenter.aggregate([
      { $unwind: "$Periods" },
      {
        $match: {
          $or: [
            {
              "Periods.dateFrom": { $gte: dateFromIsoString },
              "Periods.dateTo": { $lte: dateToIsoString },
            },
            {
              "Periods.dateFrom": { $lte: dateToIsoString },
              "Periods.dateTo": { $gte: dateToIsoString },
            },
            {
              "Periods.dateFrom": { $lte: dateFromIsoString },
              "Periods.dateTo": { $gte: dateFromIsoString },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            State: "$State",
            Schedule: "$Schedule",
          },
          appliedVaccines: { $sum: "$Periods.givenDoses" },
        },
      },
    ]);

    return response;
  }
};
