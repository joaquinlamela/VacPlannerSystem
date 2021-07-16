const moment = require("moment");
const { FORMATS_DATE } = require("../../../Tools/constants");
const anotherFormat = "YYYY-MM-DDThh:mm:ssZ";
var VALID_FORMAT_DATE;

var errorMessage = "";
const filter = {
  checkConditions: (input, next) => {
    if (isValidVaccinationDate(input.ReservationDate)) {
      input.ReservationDate = transformDate(input.ReservationDate);
      next(null, input);
    } else {
      next(errorMessage, null);
    }
  },
  setParameters: (parameters) => {
    const parametersForReserveDate = parameters.ReservationDate;
    VALID_FORMAT_DATE = parametersForReserveDate.internalFormat;
  },
};

module.exports = filter;

function isValidVaccinationDate(date) {
  if (date === null) {
    errorMessage = "La fecha no puede ser vacía";
    return false;
  }
  
  if (isValidDateFormat(date)) {
    let today = new Date();
    let dateTransformed = new Date(moment(date, FORMATS_DATE, true).format(anotherFormat));

    if (moment(dateTransformed).isBefore(today)) {
      errorMessage = "Fecha Invalida";
      return false;
    }
    return true;
  } else {
    errorMessage = "La fecha de la reserva no es válida.";
    return false;
  }
}

function isValidDateFormat(date) {
  return moment(date, FORMATS_DATE, true).isValid();
}

function transformDate(date) {
  return moment(date, FORMATS_DATE, true).format(VALID_FORMAT_DATE);
}
