const Queue = require("bull");
const config = require("config");
const queueName = config.get("queues.senderQueue");

module.exports = class PipeQueue {
  constructor() {
    this.queue = new Queue(queueName);
  }

  async enqueue(topic, requestBody) {
    try { 
      await this.queue.add(topic, requestBody);
    } catch (err) {
      throw err;
    }
  }
};
