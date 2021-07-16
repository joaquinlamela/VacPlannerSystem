const VacPlannerDb = require("../../../Tools/Connections/VacPlannerDbConnection");
module.exports = class AuthenticationRepository {
  async getCredentials(workerNumber, password) {
    try {
      return await VacPlannerDb.Credentials.findOne({
        WorkerNumber: workerNumber,
        Password: password,
      });
    } catch (ex) {
      throw new Error(`No se ha podido establecer conexion con la base de datos ${ex}`);
    }
  }
};
