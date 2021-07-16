const fs = require("fs");
const path = "./../Configurator/config/clients.json";

module.exports = class ClientRepository {
  constructor() {}

  async save(client) {
    let rawdata = fs.readFileSync(path);
    let obj = JSON.parse(rawdata);
    obj["clients"].push(client);

    fs.writeFileSync(path, JSON.stringify(obj));
  }

  async update(pos, client) {
    let rawdata = fs.readFileSync(path);
    let obj = JSON.parse(rawdata);
    let clients = obj["clients"];
    clients[pos] = client;

    fs.writeFileSync(path, JSON.stringify(obj));
  }

  async findPosition(client) {
    let rawdata = fs.readFileSync(path);
    let obj = JSON.parse(rawdata);
    let Clients = obj["clients"];

    for (let c in Clients) {
      if (Clients[c].name === client.name) return c;
    }

    return undefined;
  }

  async get() {
    let rawdata = fs.readFileSync(path);
    let obj = JSON.parse(rawdata);
    return obj["clients"];
  }
};
