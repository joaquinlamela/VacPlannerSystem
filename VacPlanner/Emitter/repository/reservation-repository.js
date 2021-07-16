const VacPlannerDb = require("../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../Tools/Connections/VacQueryDbConnection");

module.exports = class ReservationRepository {
  async save(reserve) {
    try {
      await VacPlannerDb.Reserves.create(reserve);
      return await VacQueryDb.Reserves.create(reserve);
    } catch (err) {
      throw new Error(`No se pudo contectar a la base de datos ${err}`);
    }
  }

  async get(reserve) {
    try {
      const response = await VacPlannerDb.Reserves.findOne({
        DocumentId: reserve.DocumentId,
      });

      return response ? 1 : 0;
    } catch (err) {
      throw new Error(`No se pudo contectar a la base de datos ${err}`);
    }
  }
};
