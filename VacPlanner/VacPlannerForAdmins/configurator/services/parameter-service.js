const fs = require("fs");
const ValidationParametersService = require("./validation-parameters-service");
module.exports = class ConfiguratorService {
  constructor() {
    this.validationParameterService = new ValidationParametersService();
  }

  async saveParameters(params) {
    let data = JSON.stringify(params, null, 2);
    if (this.validationParameterService.checkConditions(params)) {
      fs.writeFileSync("./config/parameters-filter.json", data);
    } else {
      throw new Error("No se han podido configurar los parametros debido a que el formato introducido es incorrecto.");
    }
  }
};
