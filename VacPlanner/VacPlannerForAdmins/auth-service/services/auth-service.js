const fs = require("fs");
const Jwt = require("jsonwebtoken");
const SECRET_KEY = fs.readFileSync("./config/private.key", "utf8");
const AuthenticationRepository = require("../repositories/authentication-repository");

const SIGN_OPTIONS = {
  expiresIn: "12h",
  algorithm: "RS256",
};

module.exports = class AuthService {
  constructor() {
    this.authenticationRepo = new AuthenticationRepository();
  }

  async login(data) {
    let credentials = await this.authenticationRepo.getCredentials(
      data.WorkerNumber,
      data.Password
    );
    let token = null;
    if (credentials) {
      token = Jwt.sign(
        {
          client: data.WorkerNumber,
          permissions: credentials.Permissions.join(","),
        },
        SECRET_KEY,
        SIGN_OPTIONS
      );
    }
    return token;
  }
};
