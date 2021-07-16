const ClientService = require("../services/client-service");
const ParameterService = require("../services/parameter-service");
const ActivityTracker = require("../../../Tools/ActivityTracker/activityTracker");

module.exports = class ConfiguratorController {
  constructor() {
    this.clientService = new ClientService();
    this.parameterService = new ParameterService();
  }

  async postClient(req, res) {
    if (this.hasPermission(req, "/configurator/clients/write")) {
      let client = req.body;
      try {
        await this.clientService.create(client);
        res.status(201);
        res.body = "Cliente agregado satisfactoriamente.";
      } catch (ex) {
        res.status(400).send;
        res.body = ex.toString();
      }
    } else {
      res.status(403);
      res.body = "Forbidden";
      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado agregar nuevas APIS externas pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }

  async putClient(req, res) {
    if (this.hasPermission(req, "/configurator/clients/write")) {
      let client = req.body;
      try {
        await this.clientService.update(client);
        res.status(200);
        res.body = "Cliente actualizado satisfactoriamente.";
      } catch (ex) {
        res.status(400);
        res.body = ex.toString();
      }
    } else {
      res.status(403);
      res.body = "Forbidden";
      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado actualizar las APIS externas pero no tiene permisos.`
      );
    }
    res.send(res.body);
  }

  async postParams(req, res) {
    if (this.hasPermission(req, "/configurator/parameters/write")) {
      let params = req.body;
      try {
        await this.parameterService.saveParameters(params);
        res.status(200);
        res.body = "Parametros configurados correctamente";
      } catch (ex) {
        res.status(400);
        res.body = ex.message;
      }
    } else {
      res.status(403);
      res.body = "Forbidden";
      ActivityTracker.log(
        `El administrador ${req.user.client} ha intentado modificar los parametros pero no tiene permisos.`
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
