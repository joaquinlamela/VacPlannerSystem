const ReservationService = require("../services/reservationService");
const timestampsService = require("../../Tools/timestampsService");
const logger = require("../../Tools/Logger/logService");

module.exports = class ReserveController {
  constructor() {
    this.reservationService = new ReservationService();
  }

  async postReserve(req, res) {
    const requestTime = Date.now();
    req.body.RequestTime = requestTime;
    try {
      let response = await this.reservationService.saveReserve(req.body);

      if (response) {
        res.status(201);
        if (response.Confirmed) {
          res.body = {
           message: `Su reserva con codigo ${response.Code} ha sido reserva para la persona con documento ${response.DocumentId} 
           para el dia ${response.ReservationDate} en el vacunatorio con codigo ${response.VaccinationCode}
           en el departamento ${response.State} y zona ${response.Zone} `
          };
        } else {
          res.body = {
            message: `Su reserva ha sido registrada con codigo ${response.Code} 
           pero actualmente no contamos con cupos. Tu reserva se asignara cuando haya nuevos cupos `,
          };
        }
      }
    } catch (error) {
      if (error.type === "validation") {
        res.status(400);
        res.body = { message: error.message };
      } else if (error.type === "not-found") {
        res.status(404);
        res.body = { message: error.message };
      } else {
        res.status(500);
        res.body = {
          message: `Ha ocurrido un error interno dentro del sistema. Por favor intentelo mas tarde.`,
        };
        logger.log(error);
      }
    }
    timestampsService.addTimestamps(res.body, requestTime);
    res.send(res.body);
  }

  async getReserve(req, res) {
    const requestTime = Date.now();
    try {
      let documentId = parseInt(req.params.documentId);
      let response = await this.reservationService.getReserve(documentId);
      if (response) {
        res.status(200);
        if (response.Confirmed) {
          res.body = `Su reserva con codigo ${response.Code} ha sido reservada
           para la persona con documento ${response.DocumentId} para el dia ${response.ReservationDate} en el vacunatorio con codigo ${response.VaccinationCode} 
           en el departamento ${response.State} y zona ${response.Zone} `;
        } else {
          res.body = {
            message: `Su reserva ha sido registrada con codigo ${response.Code} 
            pero actualmente no contamos con cupos. Tu reserva se asignara cuando haya nuevos cupos `,
          };
        }
      } else {
        res.status(404);
        res.body = {
          message: `No se ha encontrado una reserva asociada al documento ${documentId}.`,
        };
      }
    } catch (error) {
      res.status(500);
      res.body = {
        message: "Ha ocurrido un error interno dentro del sistema. Por favor intentelo mas tarde.",
      };
      logger.log(error);
    }
    timestampsService.addTimestamps(res.body, requestTime);
    res.send(res.body);
  }

  async deleteReserve(req, res) {
    try {
      let documentId = parseInt(req.query.documentId);
      let reserveCode = parseInt(req.query.code);
      let result = await this.reservationService.deleteReserve(
        documentId,
        reserveCode
      );

      if (result) {
        res.status(200);
        res.body = `La reserva con codigo ${reserveCode} para la cedula ${documentId} ha sido cancelada.`;
      } else {
        res.status(404);
        res.body = `No se ha encontrado una reserva asociada al documento ${documentId} con codigo de reserva ${reserveCode} .`;
      }
    } catch (error) {
      res.status(500);
      res.body = "Ha ocurrido un error interno dentro del sistema. Por favor intentelo mas tarde.";
      logger.log(error);
    }
    res.send(res.body);
  }
};
