const Sequelize = require("sequelize");
const config = require("config");
const url = config.get("dbUrl");

const sequelize = new Sequelize(url);

const people = sequelize.define(
  "People",
  {
    DocumentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    Name: {
      type: Sequelize.STRING,
    },
    Surname: {
      type: Sequelize.STRING,
    },
    SecondSurname: {
      type: Sequelize.STRING,
    },
    DateOfBirth: {
      type: Sequelize.STRING,
    },
    Priority: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = class IdentificationRepository {
  constructor() {}

  async findPeopleByDni(dni) {
    try {
      return await people.findOne({ where: { DocumentId: dni } });
    } catch (err) {
      throw new Error(`No se pudo contectar a la base de datos ${err}`);
    }
  }
};
