const QUEUE = require("bull");
const CONFIG = require("config");
const EMITTER_SERVICE = require("./services/emitter-service");

const QUEUE_NAME = CONFIG.get("queues.receiverQueue");
const EMMITER_QUEUE = new QUEUE(QUEUE_NAME);
const EMITTER_SERVICE_INSTANCE = new EMITTER_SERVICE();
const VacPlannerDb = require("../Tools/Connections/VacPlannerDbConnection");
const VacQueryDb = require("../Tools/Connections/VacQueryDbConnection");
const logger = require("../Tools/Logger/logService");

module.exports = async function queueListener() {
  logger.init();
  await VacPlannerDb.init();
  await VacQueryDb.init();

  EMMITER_QUEUE.process("newReserves", 3, async (job, done) => {
    let reservation = job.data;
    delete reservation["id"];

    console.log(
      `Trabajo desencolado de EmmiterQueue [${reservation.DocumentId}]`
    );
    await EMITTER_SERVICE_INSTANCE.saveReserve(reservation);
    done();
  });

  EMMITER_QUEUE.process("cancellations", async (job, done) => {
    let cancellation = job.data;
    delete cancellation["id"];

    const { reserveCode, documentId } = cancellation;
    console.log(`Trabajo desencolado de EmmiterQueue [${reserveCode}]`);
    await EMITTER_SERVICE_INSTANCE.cancelReserve(reserveCode, documentId);
    done();
  });
};
