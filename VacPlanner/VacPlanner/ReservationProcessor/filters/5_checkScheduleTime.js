var errorMessage = "";
var minScheduleTime;
var maxScheduleTime;

const filter = {
  checkConditions: (input, next) => {
    if (isValidScheduleTime(input.Schedule)) {
      next(null, input);
    } else {
      next(errorMessage, null);
    }
  },
  setParameters: (parameters) => {
    const parametersForScheduleTime = parameters.Schedule;
    minScheduleTime = parametersForScheduleTime.minValue;
    maxScheduleTime = parametersForScheduleTime.maxValue;
  },
};

module.exports = filter;

function isValidScheduleTime(scheduleTime) {
  if (scheduleTime === null) {
    errorMessage = "El horario no puede ser vacío";
    return false;
  }

  const scheduleTimeToString = scheduleTime.toString();

  if (
    scheduleTimeToString.includes("-") ||
    scheduleTimeToString.includes(".")
  ) {
    errorMessage = "El horario no puede tener . o -";
    return false;
  }

  if (isNaN(scheduleTime)) {
    errorMessage = "El horario debe ser un valor numérico";
    return false;
  }

  if (scheduleTime < minScheduleTime || scheduleTime > maxScheduleTime) {
    errorMessage = `${scheduleTime} no es un horario valido este debe estar entre ${minScheduleTime} y ${maxScheduleTime}`;
    return false;
  }
  return true;
}
