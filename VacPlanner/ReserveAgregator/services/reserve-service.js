const RESERVE_REPOSITORY = require("../repositories/reserve-repository.js");

module.exports = class ReserveService {
  constructor() {
    this.reserveRepository = new RESERVE_REPOSITORY();
  }

  async getReserves() {
    return await this.reserveRepository.findReserves();
  }
};
