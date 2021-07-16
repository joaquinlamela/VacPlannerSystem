const IDENTIFICATION_REPOSITORY = require('../repository/identificationRepo');

module.exports = class identificationService {
  constructor() {
    this.identificationRepository = new IDENTIFICATION_REPOSITORY();
  }
  async getPersonByDni(dni) {
    return await this.identificationRepository.findPeopleByDni(dni);
  }
};
