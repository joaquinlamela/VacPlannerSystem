const VacPlannerDb = require("../../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../../Tools/Connections/VacQueryDbConnection");
module.exports = class VaccinationCenterRepository {
  async save(vaccinationCenter) {
    try {
      await VacPlannerDb.VaccinationCenter.create(vaccinationCenter);
      return await VacQueryDb.VaccinationCenter.create(vaccinationCenter);
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }

  async addPeriods(vaccinationCode, periods) {
    try {
      periods.forEach((element) => {
        element.availableQuotes = element.quotes;
      });
      const response = await VacPlannerDb.VaccinationCenter.updateOne(
        { Code: vaccinationCode },
        {
          $push: { Periods: periods },
        }
      );
      await VacQueryDb.VaccinationCenter.updateOne(
        { Code: vaccinationCode },
        {
          $push: { Periods: periods },
        }
      );
      return response.nModified;
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }

  async get(vaccinationCode) {
    try {
      return await VacPlannerDb.VaccinationCenter.findOne({
        Code: vaccinationCode,
      });
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }

  async addVaccinationAct(vaccinationAct) {
    try {
      await this.updateGivenDoses(vaccinationAct.VaccinationCode,vaccinationAct.VaccinationDate);
      return await VacPlannerDb.VaccinationActs.create(vaccinationAct);
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }

  async updateGivenDoses(vaccinationCenterCode, vaccinationDate) {
    try {
      await VacPlannerDb.VaccinationCenter.findOneAndUpdate(
        { Code: vaccinationCenterCode },
        { $inc: { "Periods.$[el].givenDoses": 1 } },
        {
          arrayFilters: [
            {
              "el.dateFrom": { $lte: vaccinationDate },
              "el.dateTo": { $gte: vaccinationDate },
            },
          ],
          new: true,
        }
      );
      
      return await VacQueryDb.VaccinationCenter.findOneAndUpdate(
        { Code: vaccinationCenterCode },
        { $inc: { "Periods.$[el].givenDoses": 1 } },
        {
          arrayFilters: [
            {
              "el.dateFrom": { $lte: vaccinationDate },
              "el.dateTo": { $gte: vaccinationDate },
            },
          ],
          new: true,
        }
      );
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }

  async getVaccines(vaccinationCenterCode, date) {
    try {
      let array = await VacPlannerDb.VaccinationCenter.aggregate([
        { $unwind: "$Periods" },
        {
          $match: {
            Code: vaccinationCenterCode,
            "Periods.dateFrom": { $lte: date },
            $or: [
              { "Periods.dateTo": { $gte: date } },
              { "Periods.dateTo": { $lte: date } },
            ],
          },
        },
      ]);

      let givenVaccines = 0;
      let remainingVaccines = 0;

      for (let index in array) {
        givenVaccines += array[index].Periods.givenDoses;
        remainingVaccines += array[index].Periods.quotes - array[index].Periods.givenDoses;
      }

      return `Vacunas dadas: ${givenVaccines}
              Remanentes: ${remainingVaccines}`;
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }
};
