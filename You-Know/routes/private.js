const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();

router.get("/main", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  res.render("auth/main", { user })
});

router.get("/game", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  res.render("auth/game", { user });
});

module.exports = router;