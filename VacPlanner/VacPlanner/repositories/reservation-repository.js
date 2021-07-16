const VacPlannerDb = require("../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../Tools/Connections/VacQueryDbConnection");

module.exports = class ReservationRepository {
  async get(documentId) {
    try {
      return await VacPlannerDb.Reserves.findOne({
        DocumentId: documentId,
      });
    } catch (ex) {
      throw new Error(`No se puede conectar con la base de datos ${ex}`);
    }
  }

  async delete(documentId, reserveCode) {
    try {
      const result = await VacPlannerDb.Reserves.deleteOne({
        DocumentId: documentId,
        Code: reserveCode,
      });

      await VacQueryDb.Reserves.deleteOne({
        DocumentId: documentId,
        Code: reserveCode,
      });
      
      return result.deletedCount ? 1 : 0;
    } catch (ex) {
      throw new Error(`No se puede conectar con la base de datos ${ex}`);
    }
  }
};
