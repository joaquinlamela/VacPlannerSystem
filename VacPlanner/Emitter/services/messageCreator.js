function saveMessage(reservation) {
  const endTime = Date.now();
  const difference = endTime - reservation.RequestTime;
  return `
    Su reserva fue realizado con exito.

    Codigo de Reserva: ${reservation.Code}
    Cedula de Identidad: ${reservation.DocumentId} 
    Lugar: Departamento - ${reservation.State} 
           Zona - ${reservation.Zone}
           Codigo de Vacunatorio: - ${reservation.DocumentId} 
    Fecha: ${reservation.ReservationDate}
    
    Timestamp: Tiempo inicial : ${reservation.RequestTime} 
               Tiempo final : ${endTime}
               Diferencia de tiempo: ${difference} ms
               `;
}

function cancellationMessage(code, documentId) {
  return `
    Reserva ${code} para la Cédula de Identidad ${documentId} ha sido cancelada.
    `;
}

function errorMessage() {
  return `
    Ha ocurrido un error al confirmar su reserva, por favor intente agendarse nuevamente.
    `;
}

module.exports = {
  saveMessage,
  cancellationMessage,
  errorMessage
};
