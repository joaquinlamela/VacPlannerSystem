const express = require('express');
const router = express.Router();
const IdentificationController = require('./identification-controller');
const identificationController = new IdentificationController();

router.get('/population/:dni', (req, res, nxt) =>
  identificationController.findDni(req, res)
);

module.exports = router;
