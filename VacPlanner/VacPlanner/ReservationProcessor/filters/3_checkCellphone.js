var errorMessage = "";
var prefixToCheck = "";
var largeOfPhoneNumberToCheck;

const filter = {
  checkConditions: (input, next) => {
    if (isValidCellphone(input.Cellphone)) {
      next(null, input);
    } else {
      next(errorMessage, null);
    }
  },
  setParameters: (parameters) => {
    const parameterForCellphone = parameters.Cellphone;
    prefixToCheck = parameterForCellphone.prefix;
    largeOfPhoneNumberToCheck = parameterForCellphone.large;
  },
};

module.exports = filter;

function isValidCellphone(cellphone) {
  if (cellphone === null) {
    errorMessage = "El telefono no debe ser nulo.";
    return false;
  }
  const cellphoneToString = cellphone.toString();
  if (cellphoneToString.includes("-") || cellphoneToString.includes(".")) {
    errorMessage = "El telefono no debe contener . o -.";
    return false;
  }
  if (isNaN(cellphone)) {
    errorMessage = "El telefono no es un numero.";
    return false;
  }
  if (cellphone.length !== largeOfPhoneNumberToCheck) {
    errorMessage = `El telefono debe tener al menos ${largeOfPhoneNumberToCheck} digitos.`;
    return false;
  }
  if (!cellphone.startsWith(prefixToCheck, 0)) {
    errorMessage = `El telefono debe comenzar con el prefijo ${prefixToCheck}.`;
    return false;
  }
  return true;
}
