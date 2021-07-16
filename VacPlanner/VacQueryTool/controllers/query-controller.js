const QueryService = require("../services/query-service");
const timestampService = require("../../Tools/timestampsService");
const logger = require("../../Tools/Logger/logService");

module.exports = class QueryController {
  constructor() {
    this.queryService = new QueryService();
  }

  async getAppliedVaccines(req, res) {
    const requestTime = Date.now();
    const params = req.query;

    try {
      let value = await this.queryService.listAppliedVaccines(params);
      res.status(201);
      res.body = { value };
    } catch (ex) {
      if (ex.type === "validation") {
        res.status(400);
        res.body = ex.toString();
      } else if (ex instanceof RangeError) {
        res.status(400);
        res.body = ex.toString();
      } else {
        res.status(500);
        res.body = {
          message: `Ha ocurrido un error interno dentro del sistema. 
          Por favor intentelo mas tarde.`,
        };
        logger.log(ex);
      }
    }
    timestampService.addTimestamps(res.body, requestTime);
    res.send(res.body);
  }

  async getPendingReserves(req, res) {
    const requestTime = Date.now();
    try {
      let value = await this.queryService.listPendingReserves();
      res.status(201);
      res.body = { value };
    } catch (ex) {
      res.status(500);
      res.body = {
        message: `Ha ocurrido un error interno dentro del sistema. 
        Por favor intentelo mas tarde.`,
      };
      logger.log(ex);
    }
    timestampService.addTimestamps(res.body, requestTime);
    res.send(res.body);
  }
};
