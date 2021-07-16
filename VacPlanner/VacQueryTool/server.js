const express = require("express");
const app = express();
const config = require("config");
const port = config.get("server.port");
const url = config.get("server.url");
const router = require("./controllers/router");
const cors = require("cors");

const logger = require("../Tools/Logger/logService");
const mongoDb = require("../Tools/Connections/VacQueryDbConnection");

module.exports.initServer = async function () {
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(url, router);

  await mongoDb.init();
  logger.init();

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
};
