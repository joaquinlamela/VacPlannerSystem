const MOMENT = require("moment");

module.exports = class Log {
  constructor(message) {
    let currentDate = MOMENT().utcOffset(-3).format("YYYY-MM-DD HH:mm:ss");
    this.Date = currentDate;
    this.Message = message;
  }
};
