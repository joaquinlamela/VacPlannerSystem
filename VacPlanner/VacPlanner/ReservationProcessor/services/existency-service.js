const config = require("config");
const http = require("../../../Tools/httpService");
const logger = require("../../../Tools/Logger/logService");
const IdentityProvider = config.get("identityProvider");
const IdentityProviderEndpoint = IdentityProvider.personByDniEndpoint;
const Params = require("../../../VacPlannerForAdmins/configurator/config/parameters-filter.json");

module.exports = class RequestService {
  constructor() {}

  async isValidIdentity(documentId) {
    let endpoint = `${IdentityProviderEndpoint}${documentId}`;

    let response = await http.get(endpoint)
      .then((response) => {
        let birthDate = response.data.DateOfBirth;
        if (this.isValidBirthDate(birthDate)) return response.data;

        let validationError = new Error(`La edad de la persona no es valida para este periodo.`);
        validationError.type = "validation";
        throw validationError;
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 404) {
          let notFoundError = new Error(`No se ha encontrado la cedula en la base de datos.`);
          notFoundError.type = "not-found";
          throw notFoundError;
        } else if (ex.request) {
          logger.log(ex);
          throw new Error(`No se pudo conectar a la base de datos ${ex}`);
        } else {
          throw ex;
        }
      });

    return response;
  }

  isValidBirthDate(birthDate) {
    let age = this.calculateAge(birthDate);
    return age >= Params.Age.minValue && age <= Params.Age.maxValue;
  }

  calculateAge(birthDate) {
    let today = new Date();
    let birthDateInFormat = new Date(birthDate);
    let age = today.getFullYear() - birthDateInFormat.getFullYear();
    let monthDifference = today.getMonth() - birthDateInFormat.getMonth();
    
    if (monthDifference < 0 ||(monthDifference === 0 && today.getDate() < birthDateInFormat.getDate())) 
      age--;
    
    return age;
  }
};
