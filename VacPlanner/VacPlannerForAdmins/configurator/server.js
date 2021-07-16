const express = require("express");
const app = express();
const config = require("config");
const port = config.get("server.port");
const url = config.get("server.url");
const router = require("./controllers/router");
const cors = require("cors");

const logger = require("../../Tools/Logger/logService");

module.exports.initServer = async function () {
  app.use(cors());
  app.use(express.urlencoded({ limit: "125mb", extended: false }));
  app.use(express.json({ limit: "125mb" }));
  app.use(url, router);

  logger.init();

  app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
  });
};
