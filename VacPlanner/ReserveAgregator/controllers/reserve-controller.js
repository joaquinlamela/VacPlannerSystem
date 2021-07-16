const RESERVE_SERVICE = require("../services/reserve-service");
const AXIOS = require("axios");
const CONFIG = require("config");
const RECEIVER = CONFIG.get("receiver");
const RECEIVER_URL = RECEIVER.receiverUrl;
const RECEIVER_ENDPOINT = RECEIVER.reserveEndpoint;
const bottleneck = require("bottleneck");

const limiter = new bottleneck({
  minTime: 50,
});

async function getMyData(data) {
  const axiosConfig = {
    url: `${RECEIVER_URL}${RECEIVER_ENDPOINT}`,
    method: "post",
    data,
  };
  return AXIOS(axiosConfig);
}

const throttledGetMyData = limiter.wrap(getMyData);

module.exports = class ReserveController {
  constructor() {
    this.reserveService = new RESERVE_SERVICE();
  }

  async postReserves() {
    var reserves = await this.reserveService.getReserves();

    const allThePromises = reserves.map((reserve) => {
      return throttledGetMyData(reserve);
    });

    try {
      const results = await Promise.all(allThePromises);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  }
};
