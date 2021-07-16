function addTimestamps(obj, reqTime) {
  const responseTime = Date.now();
  const difference = responseTime - reqTime;
  obj.startTime = reqTime;
  obj.endTime = responseTime;
  obj.difference = difference + " ms";
}

module.exports = {
  addTimestamps,
};
