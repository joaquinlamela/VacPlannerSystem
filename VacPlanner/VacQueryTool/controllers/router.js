const express = require("express");
const router = express.Router();
const QueryController = require("./query-controller");
const queryController = new QueryController();

router.get("/vaccines/applied", (req, res, nxt) =>
  queryController.getAppliedVaccines(req, res)
);

router.get("/reserves/pending", (req, res, nxt) =>
  queryController.getPendingReserves(req, res)
);

module.exports = router;
