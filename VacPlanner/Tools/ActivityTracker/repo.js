const Sequelize = require("sequelize");
const config = require("./config/development.json");
const url = config.ActivityTrackerDb;

const sequelize = new Sequelize(url, {
  timezone: "-03:00",
});

const auditory = sequelize.define(
  "auditorytails",
  {
    Id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    Date: {
      type: Sequelize.DATE(6),
    },
    Message: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

async function save(log) {
  try {
    return await auditory.create(log);
  } catch (err) {
    throw new Error(`No se pudo conectar a la base de datos ${err}`);
  }
}

module.exports = {
  save,
};
