const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "mysql://root:12345678@localhost:3306/ReserveInformation"
);
const DB1 = "reserves";
const DB2 = "secondReserves";
const DB3 = "thirddataset";

const databaseReserve1 = sequelize.define(
  DB1,
  {
    DocumentId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    Cellphone: {
      type: Sequelize.STRING,
    },
    ReservationDate: {
      type: Sequelize.STRING,
    },
    Schedule: {
      type: Sequelize.STRING,
    },
    State: {
      type: Sequelize.STRING,
    },
    Zone: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const databaseReserve2 = sequelize.define(
  DB2,
  {
    DocumentId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    Cellphone: {
      type: Sequelize.STRING,
    },
    ReservationDate: {
      type: Sequelize.STRING,
    },
    Schedule: {
      type: Sequelize.STRING,
    },
    State: {
      type: Sequelize.STRING,
    },
    Zone: {
      type: Sequelize.STRING,
    },
    ErrorField: {
      type: Sequelize.STRING,
    },
    ErrorDescription: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

const databaseReserve3 = sequelize.define(
  DB3,
  {
    DocumentId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    Cellphone: {
      type: Sequelize.STRING,
    },
    ReservationDate: {
      type: Sequelize.STRING,
    },
    Schedule: {
      type: Sequelize.STRING,
    },
    State: {
      type: Sequelize.STRING,
    },
    Zone: {
      type: Sequelize.STRING,
    },
    ErrorField: {
      type: Sequelize.STRING,
    },
    ErrorDescription: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = class ReserveRepository {
  constructor() {}

  async findReserves() {
    const reserves = await databaseReserve1.findAll();
    return reserves;
  }
};
