const express = require("express");
const router = express.Router({ mergeParams: true });

const users = require("../controllers/users");

router.route('/users/:userId')
      .get(users.findUser);

router.route('/users/register')
      .post(users.registerUser);

router.route('/users/login')
      .post(users.loginUser);

router.route('/users/update')
      .put(users.updateUser);

module.exports = router;