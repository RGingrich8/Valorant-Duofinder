const express = require("express");
const router = express.Router({ mergeParams: true });

const matchings = require("../controllers/matchings");

router.route('/matchings/:userId')
      .get(matchings.retrieveMatchHistory);

module.exports = router;