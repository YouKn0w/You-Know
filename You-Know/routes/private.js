const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();

router.get("/main", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/main", { user })
  }
});

router.get("/game", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/game", { user });
  }
});

module.exports = router;