const RESERVE_CONTROLLER = require("./controllers/reserve-controller");
const RESERVE_CONTROLLER_INSTANCE = new RESERVE_CONTROLLER();

(async () => {
  await RESERVE_CONTROLLER_INSTANCE.postReserves();
})();
