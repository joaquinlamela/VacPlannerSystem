const AuthService = require("../services/auth-service");
const ActivityTracker = require("../../../Tools/ActivityTracker/activityTracker");
const logger = require("../../../Tools/Logger/logService");
module.exports = class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      let data = req.body;
      let token = await this.authService.login(data);
      if (token) {
        res.status(200);
        res.body = token;
        ActivityTracker.log(
          `El usuario con numero de funcionario ${data.WorkerNumber} se ha logueado correctamente.`
        );
      } else {
        res.status(401);
        res.body = "Unauthorized";
        ActivityTracker.log(
          `El usuario con numero de funcionario ${data.WorkerNumber} ha intentado loguearse pero no esta autorizado.`
        );
      }
    } catch (error) {
      res.status(500);
      res.body = `Ha ocurrido un error interno dentro del sistema. 
      Por favor intentelo mas tarde.`;
      logger.log(error);
    }
    res.send(res.body);
  }
};
