const filter = {
  checkConditions: (input, next) => {
    if (
      input &&
      input.hasOwnProperty("DocumentId") &&
      input.DocumentId &&
      input.hasOwnProperty("Cellphone") &&
      input.Cellphone &&
      input.hasOwnProperty("ReservationDate") &&
      input.ReservationDate &&
      input.hasOwnProperty("Schedule") &&
      input.Schedule &&
      input.hasOwnProperty("State") &&
      input.State &&
      input.hasOwnProperty("Zone") &&
      input.Zone
    ) {
      next(null, input);
      return;
    }

    next("Hay datos faltantes para la entrada", null);
    return;
  },
  setParameters: (parameters) => {},
};

module.exports = filter;
