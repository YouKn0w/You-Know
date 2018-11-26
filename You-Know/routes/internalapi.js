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

module.exports = router;