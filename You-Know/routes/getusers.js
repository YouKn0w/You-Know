const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary');

router.get('/profile/:userId', (req, res, next) => {
  User.findById(req.params.userId, ["username", "points", "imagePath", "stadistics"])
    .then(user => {
      User.find({}, "points").sort({ 'points': -1 })
        .then(users => {
          let position = 0
          users.forEach((userr, index) => {
            if (userr.id === user.id) {
              position = index + 1
            }
          })
          res.render("auth/profile", { user, position })
        })
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

router.get('/editprofile/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      res.render("auth/editprofile", { user })
    })
    .catch(err => res.json(err))
})

router.post('/editprofile/:userId', uploadCloud.single('photo'), (req, res, next) => {
  userEdited = {}
  userEdited.password = req.body.password;
  userEdited.email = req.body.email;
  if (req.file === undefined) {
    userEdited.imagePath = req.user.imagePath
  } else {
    userEdited.imagePath = req.file.url
  }
  User.findByIdAndUpdate(req.params.userId, userEdited)
    .then(user => {
      res.redirect(`/profile/${user.id}`)
    })
    .catch(err => res.json(err))
})

router.get('/ranking', (req, res, next) => {
  User.find({}, ["username", "points", "imagePath", "stadistics"]).sort({ 'points': -1 }).limit(20)
    .then(user => {
      res.render("auth/ranking", { user })
    })
});

router.get('/stadistics', (req, res, next) => {
  User.find({}, "stadistics")
    .then(stadistics => {
      res.render("auth/stadistics", { stadistics })
    })
});

module.exports = router;