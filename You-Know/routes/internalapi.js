const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");

router.get('/getcategories', ensureLoggedIn("/login"), (req, res, next) => {
  Category.find({}, "name")
    .then((categories) => {
      res.json(categories)
    })
    .catch(err => console.log(err))
});

router.post('/getquestions', ensureLoggedIn("/login"), (req, res, next) => {
  difficulty = req.body.difficulty
  rounds = req.body.rounds
  categoryId = req.body.categoryId
  
});

module.exports = router;