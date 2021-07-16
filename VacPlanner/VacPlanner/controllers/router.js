const express = require("express");
const router = express.Router();
const ReserveController = require("./reserve-controller");
const reserveController = new ReserveController();

router.post("/reserves", (req, res, nxt) =>
  reserveController.postReserve(req, res, nxt)
);

router.delete("/reserves/", (req, res, nxt) =>
  reserveController.deleteReserve(req, res, nxt)
);

router.get("/reserves/:documentId", (req, res, nxt) =>
  reserveController.getReserve(req, res, nxt)
);

module.exports = router;
