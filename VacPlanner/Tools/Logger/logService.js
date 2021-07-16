const Sentry = require("@sentry/node");

function init() {
  Sentry.init({
    dsn: "https://6812c504d8ab406eb4249a879fd8d6cd@o702617.ingest.sentry.io/5778798",
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  Sentry.captureException(error);
}

module.exports = {
  init,
  log,
};
