const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const PUBLIC_KEY = fs.readFileSync("./config/public.key", "utf8");
const ActivityTracker = require("../../../Tools/ActivityTracker/activityTracker");
const router = express.Router();
const VaccinationCenterController = require("./vaccination-center-controller");
const vaccinationController = new VaccinationCenterController();

router.post("/vaccinationCenter", authenticateToken, (req, res, nxt) =>
  vaccinationController.create(req, res, nxt)
);

router.post("/vaccinationPeriod", authenticateToken, (req, res, nxt) =>
  vaccinationController.addPeriod(req, res, nxt)
);
router.post("/vaccinationAct", authenticateToken, (req, res, nxt) =>
  vaccinationController.addVaccinationAct(req, res, nxt)
);

router.get("/vaccinationCenter/vaccines", authenticateToken, (req, res, nxt) =>
  vaccinationController.getVaccines(req, res, nxt)
);
router.get(
  "/vaccinationCenter/pendingReserves",
  authenticateToken,
  (req, res, nxt) =>
    vaccinationController.getPendingReserves(req, res, nxt)
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
