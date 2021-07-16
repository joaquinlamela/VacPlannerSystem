const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const config = require("./config/development.json")
const url = config.VacPlannerDb;

const VaccinationCenter = require("./models/vaccination-center");
const Reserve = require("./models/reserve");
const VaccinationAct = require("./models/vaccination-act");
const User = require("./models/user");
const models = [VaccinationCenter, Reserve, VaccinationAct, User];

async function init() {
  try {
    await loadCollections(models);
    ignore();
    console.log("Conectado a la base de datos VacPlanner");
  } catch (err) {
    throw new Error(`No se pudo conectar a la base de datos ${err}`);
  }
}

async function loadCollections(models) {
  const connection = await Mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  models.forEach((model) => {
    const schema = new Schema(model, { id: false }, { versionKey: false });

    schema.set("toObject", {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    });
  });

  module.exports.VaccinationCenter = connection.model(
    "VaccinationCenter",
    VaccinationCenter,
    "VaccinationCenter"
  );

  module.exports.Reserves = connection.model("Reserves", Reserve, "Reserves");

  module.exports.Credentials = connection.model(
    "Credentials",
    User,
    "Credentials"
  );

  module.exports.VaccinationActs = connection.model(
    "VaccinationActs",
    VaccinationAct,
    "VaccinationActs"
  );
}

function ignore() {
  Mongoose.set("useFindAndModify", false);
}

module.exports = {
  init,
};
