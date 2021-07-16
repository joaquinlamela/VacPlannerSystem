const express = require("express");
const router = express.Router();
const ConfigurationController = require("./configurator-controller");
const configController = new ConfigurationController();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const ActivityTracker = require("../../../Tools/ActivityTracker/activityTracker");
const PUBLIC_KEY = fs.readFileSync("./config/public.key", "utf8");

router.post("/clients", authenticateToken, (req, res, nxt) =>
  configController.postClient(req, res, nxt)
);

router.put("/clients", authenticateToken, (req, res, nxt) =>
  configController.putClient(req, res, nxt)
);

router.post("/params", authenticateToken, (req, res, nxt) =>
  configController.postParams(req, res, nxt)
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    ActivityTracker.log(
      `Alguien el cual no tiene un token valido dentro del sistema esta queriendo hacer uso de sus servicios.`
    );
    return res.sendStatus(401);
  }

  jwt.verify(token, PUBLIC_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
