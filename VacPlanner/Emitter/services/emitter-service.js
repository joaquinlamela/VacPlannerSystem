const http = require("../../Tools/httpService");
const ReservationRepository = require("../repository/reservation-repository");
const ClientRepository = require("../repository/client-repository");
const messageCreator = require("./messageCreator");
const logger = require("../../Tools/Logger/logService");

module.exports = class EmitterService {
  constructor() {
    this.reservationRepository = new ReservationRepository();
    this.clientRepository = new ClientRepository();
    this.clients = this.clientRepository.get();
  }

  async saveReserve(reserve) {
    try {
      await this.sendMessageToClients(messageCreator.saveMessage(reserve));
      delete reserve.RequestTime;

      await this.reservationRepository.save(reserve);
    } catch (ex) {
      this.sendMessageToClients(messageCreator.errorMessage());
      logger.log(ex);
    }
  }

  async cancelReserve(code, documentId) {
    try {
      await this.sendMessageToClients(
        messageCreator.cancellationMessage(code, documentId)
      );
    } catch (ex) {
      this.sendMessageToClients(messageCreator.errorMessage());
      logger.log(ex);
    }
  }

  async sendMessageToClients(message) {
    for (let client of this.clients) {
      await http.post(client.url, { message }).catch((err) => {
        logger.log(err);
      });
    }
  }
};
