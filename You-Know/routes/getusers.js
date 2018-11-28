const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const Game = require("../models/Game");
const User = require("../models/User");
const axios = require('axios');
const lodash = require('lodash');

router.get('/profile/:userId', (req, res, next) => {
  User.findById(req.params.userId, ["username", "points", "imagePath", "stadistics"])
    .then(user => {
      res.render("auth/login", { user })
    })
});

router.get('/ranking', (req, res, next) => {
  User.find({}, ["username", "points", "imagePath", "stadistics"]).sort({ 'points': -1 }).limit(20)
    .then(users => {
      res.json(users)
    })
});

router.get('/stadistics', (req, res, next) => {
  User.find({}, "stadistics")
    .then(users => {
      res.json(users)
    })
});

module.exports = router;