const { FORMATS_DATE } = require("../../../Tools/constants");
module.exports = class ValidationParametersService {
  constructor() {}

  checkConditions(parameters) {
    if (this.inputHasCorrectFields(parameters)) {
      if (this.inputHasCorrectValidationFields(parameters)) {
        return (
          this.isValidDocumentIdFormat(
            parameters.DocumentId.minLarge,
            parameters.DocumentId.maxLarge
          ) &&
          this.isValidCellphoneFormat(
            parameters.Cellphone.prefix,
            parameters.Cellphone.large
          ) &&
          this.isValidReservationDate(
            parameters.ReservationDate.internalFormat
          ) &&
          this.isValid(
            parameters.Schedule.minValue,
            parameters.Schedule.maxValue
          ) &&
          this.isValid(parameters.State.minValue, parameters.State.maxValue) &&
          this.isValid(parameters.Zone.minValue, parameters.Zone.maxValue) &&
          this.isValid(parameters.Age.minValue, parameters.Age.maxValue)
        );
      }
    }
    return false;
  }

  inputHasCorrectFields(input) {
    return (
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
      input.Zone &&
      input.hasOwnProperty("Age") &&
      input.Age
    );
  }

  inputHasCorrectValidationFields(input) {
    return (
      input &&
      input.DocumentId.hasOwnProperty("minLarge") &&
      input.DocumentId.minLarge &&
      input.DocumentId.hasOwnProperty("maxLarge") &&
      input.DocumentId.maxLarge &&
      input.Cellphone.hasOwnProperty("prefix") &&
      input.Cellphone.prefix &&
      input.Cellphone.hasOwnProperty("large") &&
      input.Cellphone.large &&
      input.ReservationDate.hasOwnProperty("internalFormat") &&
      input.ReservationDate.internalFormat &&
      input.Schedule.hasOwnProperty("minValue") &&
      input.Schedule.minValue &&
      input.Schedule.hasOwnProperty("maxValue") &&
      input.Schedule.maxValue &&
      input.State.hasOwnProperty("minValue") &&
      input.State.minValue &&
      input.State.hasOwnProperty("maxValue") &&
      input.State.maxValue &&
      input.Zone.hasOwnProperty("minValue") &&
      input.Zone.minValue &&
      input.Zone.hasOwnProperty("maxValue") &&
      input.Zone.maxValue &&
      input.Age.hasOwnProperty("minValue") &&
      input.Age.minValue &&
      input.Age.hasOwnProperty("maxValue") &&
      input.Age.maxValue
    );
  }

  isValidDocumentIdFormat(minLarge, maxLarge) {
    return minLarge > 0 && maxLarge >= minLarge;
  }

  isValidCellphoneFormat(prefix, large) {
    return prefix.match(/^[0-9]+$/) && large > 0;
  }

  isValidReservationDate(reservationDate) {
    return FORMATS_DATE.includes(reservationDate);
  }

  isValid(minValue, maxValue) {
    return minValue > 0 && maxValue >= minValue;
  }
};
