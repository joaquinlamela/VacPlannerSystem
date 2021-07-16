const express = require("express");
const router = express.Router();
const AuthController = require("./auth-controller");
const authController = new AuthController();

router.post("/login", (req, res, nxt) =>
  authController.login(req, res, nxt)
);

module.exports = router;
