const MongoService = require("../../Tools/Connections/VacQueryDbConnection");
module.exports = class ReservationRepository {
  async getPendingReservesByState() {
    let response = await MongoService.Reserves.aggregate([
      { $match: { Confirmed: false } },
      {
        $group: {
          _id: "$State",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          state: "$_id",
          _id: 0,
          count: 1,
        },
      },
    ]);

    return response;
  }
};
