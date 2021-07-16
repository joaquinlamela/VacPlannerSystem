const express = require('express');
const router = express.Router();
const MessageController = require('./message-controller');
const messageController = new MessageController();

router.post('/message', (req, res, nxt) => messageController.postMessage(req, res));

module.exports = router;
