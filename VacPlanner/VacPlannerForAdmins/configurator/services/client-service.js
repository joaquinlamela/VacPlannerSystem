const ClientRepository = require("../repositories/client-repository");

module.exports = class ConfiguratorService {
  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async create(client) {
    var pos = await this.clientRepository.findPosition(client);
    if (pos != undefined) throw Error("El cliente ya se encuentra subscripto.");

    this.clientRepository.save(client);
    return "Cliente agregado satisfactoriamente.";
  }

  async update(client) {
    var pos = await this.clientRepository.findPosition(client);
    if (pos === undefined)
      throw Error("El cliente que desea actualizar no existe en el sistema.");

    this.clientRepository.update(pos, client);
    return "Cliente actualizado satisfactoriamente.";
  }
};
