const AbstractValidationLine = require("./abstract-validation-line");

class DirectLine extends AbstractValidationLine {
  constructor() {
    super();
    this.result = {};
  }

  run(input) {
    let pendingFilters = this.filters.slice();
    let loop = (err, resultValue) => {
      if (err) {
        this.result = { error: err };
        return;
      }
      if (pendingFilters.length === 0) {
        this.result = { result: resultValue };
        return;
      }
      let filter = pendingFilters.shift();
      filter.checkConditions.call(this, resultValue, loop);
    };
    loop(null, input);
    return this.result;
  }
}

module.exports = DirectLine;
