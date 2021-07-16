const VaccinationCenterService = require("../services/vaccination-center-service");
const ActivityTracker = require("../../../Tools/ActivityTracker/activityTracker");
const logger = require("../../../Tools/Logger/logService");

module.exports = class VaccinationCenterController {
  constructor() {
    this.vaccinationCenterService = new VaccinationCenterService();
  }

  async create(req, res) {
    if (this.hasPermission(req, "/vaccinationCenter/write")) {
      try {
        let vaccinationCenter = await this.vaccinationCenterService.save(
          req.body
        );
        res.status(201);
        res.body = vaccinationCenter;

        ActivityTracker.log(
          `El administrador ${req.user.client} ha creado el vacunatorio ${vaccinationCenter.Code}`
        );
      } catch (ex) {
        if (ex.type === "validation") {
          res.status(400);
          res.body = ex.toString();
        } else if (ex.type === "not-found") {
          res.status(404);
          res.body = ex.toString();
        } else {
          res.status(500);
          res.body = {
            message: `Ha ocurrido un error interno dentro del sistema. 
                    Por favor intentelo mas tarde.`,
          };
          logger.log(ex);
        }
        ActivityTracker.log(
          `El administrador ${req.user.client} ha intentado crear un vacunatorio pero introdujo datos erroneos.`
        );
      }
    } else {
      res.status(403);
      res.body = "Forbidden";

      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado crear un vacunatorio pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }

  async addPeriod(req, res) {
    if (this.hasPermission(req, "/vaccinationCenter/write")) {
      try {
        let vaccinationCenter = await this.vaccinationCenterService.addPeriod(
          req.body
        );
        res.status(201);
        res.body = vaccinationCenter;

        ActivityTracker.log(
          `El administrador ${req.user.client} ha agregado periodos de vacunación al vacunatorio ${vaccinationCenter.Code}.`
        );
      } catch (ex) {
        if (ex.type === "validation") {
          res.status(400);
          res.body = ex.toString();
        } else if (ex.type === "not-found") {
          res.status(404);
          res.body = ex.toString();
        } else {
          res.status(500);
          res.body = {
            message: `Ha ocurrido un error interno dentro del sistema. 
                    Por favor intentelo mas tarde.`,
          };
          logger.log(ex);
        }
        ActivityTracker.log(
          `El administrador ${req.user.client} ha intentado agregar cupos a un vacunatorio pero introdujo datos erroneos.`
        );
      }
    } else {
      res.status(403);
      res.body = "Forbidden";

      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado agregar periodos a un vacunatorio pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }

  async addVaccinationAct(req, res) {
    if (this.hasPermission(req, "/vaccinationAct/write")) {
      try {
        let vaccinationAct =
          await this.vaccinationCenterService.addVaccinationAct(req.body);
        res.status(201);
        res.body = vaccinationAct;

        ActivityTracker.log(
          `El vacunador ${req.user.client} ha registrado la vacuna de ${vaccinationAct.DocumentId} en ${vaccinationAct.VaccinationCode}.`
        );
      } catch (ex) {
        if (ex.type === "validation") {
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

        ActivityTracker.log(
          `El vacunador ${req.user.client} ha intentado registrar una vacunación pero se produjo un error.`
        );
      }
    } else {
      res.status(403);
      res.body = "Forbidden";
      ActivityTracker.log(
        `El vacunador ${req.user.client} ha intentado registrar un acto vacunal pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }

  async getPendingReserves(req, res) {
    if (this.hasPermission(req, "/vaccinationCenter/query")) {
      try {
        let response =
          await this.vaccinationCenterService.listPendingReserves();
        res.status(201);
        res.body = response;

        ActivityTracker.log(
          `El administrador ${req.user.client} ha obtenido la cantidad de reservas pendientes para cada departamento y zona.`
        );
      } catch (ex) {
        res.status(500);
        res.body = {
          message: `Ha ocurrido un error interno dentro del sistema. 
                    Por favor intentelo mas tarde.`,
        };
        logger.log(ex);
      }
    } else {
      res.status(403);
      res.body = "Forbidden";

      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado obtener la cantidad de reservas pendientes pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }
  async getVaccines(req, res) {
    if (this.hasPermission(req, "/vaccinationCenter/query")) {
      try {
        const params = req.query;
        var response;

        if (params.vaccinator && params.date) {
          response = await this.vaccinationCenterService.searchVaccines(
            params.vaccinator,
            params.date
          );
        }

        res.status(201);
        res.body = response;

        ActivityTracker.log(
          `El administrador ${req.user.client} obtuvo la cantidad de vacunas dadas y remantes del vacunatorio ${params.vaccinator} hasta la fecha ${params.date} .`
        );
      } catch (ex) {
        if ((ex.type = "validation")) {
          res.status(400);
          res.body = ex.toString();
        } else if (ex.type === "not-found") {
          res.status(404);
          res.body = ex.toString();
        } else {
          res.status(500);
          res.body = {
            message: `Ha ocurrido un error interno dentro del sistema. 
                      Por favor intentelo mas tarde.`,
          };
          logger.log(ex);
        }
        ActivityTracker.log(
          `El administrador ${req.user.client} ha intentado obtener la cantidad de vacunas dadas y remanentes del vacunatorio ${req.body.vaccinator} pero se produjo un error.`
        );
      }
    } else {
      res.status(403);
      res.body = "Forbidden";

      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado obtener la cantidad de vacunas dadas y remantes del vacunatorio ${req.query.vaccinator} pero no tiene permisos. `
      );
    }

    res.send(res.body);
  }

  hasPermission(req, permission) {
    let data = req.user;
    let permissions = data.permissions.split(",");
    return permissions.includes(permission);
  }
};
