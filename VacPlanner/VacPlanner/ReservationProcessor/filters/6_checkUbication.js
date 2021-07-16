var errorMessage = "";
var minZoneValue;
var maxZoneValue;
var minStateValue;
var maxStateValue;

const filter = {
  checkConditions: (input, next) => {
    if (isValidUbication(input.Zone, input.State)) {
      next(null, input);
    } else {
      next(errorMessage, null);
    }
  },
  setParameters: (parameters) => {
    const parametersForState = parameters.State;
    const parametersForZone = parameters.Zone;
    minZoneValue = parametersForZone.minValue;
    maxZoneValue = parametersForZone.maxValue;
    minStateValue = parametersForState.minValue;
    maxStateValue = parametersForState.maxValue;
  },
};

module.exports = filter;

function isValidUbication(zone, state) {
  if (zone === null || state === null) {
    errorMessage = "La zona y/o estado no pueden ser null.";
    return false;
  }
  const zoneToString = zone.toString();
  const stateToString = state.toString();

  if (zoneToString.includes("-") || zoneToString.includes(".")) {
    errorMessage = "La zona no puede contener puntos ni guiones.";
    return false;
  }

  if (isNaN(zone)) {
    errorMessage = "La zona debe ser un valor numerico.";
    return false;
  }

  if (zone < minZoneValue || zone > maxZoneValue) {
    errorMessage = `${zone} no es una zona valida esta debe estar entre ${minZoneValue} y ${maxZoneValue}.`;
    return false;
  }

  if (stateToString.includes("-") || stateToString.includes(".")) {
    errorMessage = "El estado no puede contener puntos ni guiones.";
    return false;
  }

  if (isNaN(state)) {
    errorMessage = "El estado debe ser un valor numerico.";
    return false;
  }

  if (state < minStateValue || state > maxStateValue) {
    errorMessage = `El estado debe ser un valor numerico entre ${minStateValue} y ${maxStateValue}.`;
    return false;
  }

  return true;
}
