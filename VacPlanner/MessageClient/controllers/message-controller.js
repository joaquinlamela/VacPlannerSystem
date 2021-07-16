const MESSAGE_SERVICE = require('../services/message-service');

module.exports = class MessageController {
  constructor() {
    this.messageService = new MESSAGE_SERVICE();
  }

  postMessage(req, res) {
    let message = req.body.message;

    try {
      const value = this.messageService.displayMessage(message);

      if (value) {
        res.status(201);
        res.body = value;
      } else {
        res.status(400);
        res.body = { status: 400, message: `Bad Request` };
      }
    } catch (err) {
      console.log(err);
    }
    res.send(res.body);
  }
};
