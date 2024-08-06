const express = require("express");
const router = express.Router({ mergeParams: true });

const chats = require("../controllers/chats");

router.route('/chats/retrieve')
      .post(chats.retrieveMessages);

router.route('/chats/save')
      .post(chats.saveMessage);

module.exports = router;