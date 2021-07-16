const express = require("express");
const app = express();
const config = require("config");
const port = config.get("server.port");
const url = config.get("server.url");
const router = require("./controllers/router");
const cors = require("cors");

const logger = require("../../Tools/Logger/logService");
const VacPlannerDb = require("../../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../../Tools/Connections/VacQueryDbConnection");

module.exports.initServer = async function () {
  app.use(cors());
  app.use(express.urlencoded({ limit: "125mb", extended: false }));
  app.use(express.json({ limit: "125mb" }));
  app.use(url, router);

  logger.init();
  await VacPlannerDb.init();
  await VacQueryDb.init();

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
};
