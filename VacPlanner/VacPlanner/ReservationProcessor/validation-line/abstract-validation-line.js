const EventEmitter = require('events'),
Util = require('util');

class AbstractValidationLine {
    constructor() {
        this.filters = [];
        EventEmitter.call(this);
        Util.inherits(AbstractValidationLine, EventEmitter);
    }
    use(filter) {
        this.filters.push(filter);
        return this;
    }
    run(input) {
        throw new Error('Not implemented');
    }
}

module.exports = AbstractValidationLine;