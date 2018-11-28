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

// router.get("/profile", ensureLoggedIn("/login"), (req, res, next) => {
//   user = req.user
//   if (user.status !== "Active") {
//     res.render("auth/login", { message: "This account isnt Activated" });
//   } else {
//     res.render("auth/profile", { user });
//   }
// });

// router.get("/ranking", ensureLoggedIn("/login"), (req, res, next) => {
//   user = req.user
//   if (user.status !== "Active") {
//     res.render("auth/login", { message: "This account isnt Activated" });
//   } else {
//     res.render("auth/ranking", { user });
//   }
// });

router.get("/new", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/new", { user });
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