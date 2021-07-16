var errorMessage = "";
var minLargeOfDocument;
var maxLargeOfDocument;

const filter = {
  checkConditions: (input, next) => {
    if (isValidDni(input.DocumentId)) {
      next(null, input);
    } else {
      next(errorMessage, null);
    }
  },
  setParameters: (parameters) => {
    const parameterForDocumentId = parameters.DocumentId;
    minLargeOfDocument = parameterForDocumentId.minLarge;
    maxLargeOfDocument = parameterForDocumentId.maxLarge;
  },
};

module.exports = filter;

function isValidDni(dni) {
  if (dni === null) {
    errorMessage = "La cédula no puede ser vacía.";
    return false;
  }
  const dniString = dni.toString();
  if (dniString.includes("-") || dniString.includes(".")) {
    errorMessage = "La cédula no debería contener . o -.";
    return false;
  }
  if (isNaN(dni)) {
    errorMessage = "La cédula no es un número.";
    return false;
  }
  let dniLength = dni.toString().length;
  if (dniLength === minLargeOfDocument || dniLength === maxLargeOfDocument) {
    if (!validateDni(dniString)) {
      errorMessage = "Dígito verificador invalido.";
      return false;
    }
  } else {
    errorMessage = `El largo de la cedula cédula debe estar entre ${minLargeOfDocument} y ${maxLargeOfDocument}.`;
    return false;
  }
  return true;
}

function validateDni(dni) {
  var dig = dni[dni.length - 1];
  dni = dni.replace(/[0-9]$/, "");
  return dig == validation_digit(dni);
}

function validation_digit(dni) {
  var a = 0;
  var i = 0;
  if (dni.length <= 6) {
    for (i = dni.length; i < 7; i++) {
      dni = "0" + dni;
    }
  }
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(dni[i])) % 10;
  }
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - (a % 10);
  }
}
