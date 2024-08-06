const express = require("express");
const router = express.Router({ mergeParams: true });

const commendations = require("../controllers/commendations");

router.route('/commendations')
      .post(commendations.saveCommendation);

module.exports = router;