const IdentificationService = require("../services/identification-service");

module.exports = class IdentificationController {
  constructor() {
    this.identificationService = new IdentificationService();
  }

  async findDni(req, res) {
    let document = req.params.dni;

    try {
      var value = await this.identificationService.getPersonByDni(document);
      if (value) {
        res.status(201).send(value);
      } else if (value === null) {
        res.status(404).send({ message: `Person Not Found` });
      }
    } catch (err) {
      res.status(500).send(`No se pudo contectar a la base de datos ${err}`);
    }
  }
};
