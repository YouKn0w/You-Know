const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const User = require("../models/User");
const uploadCloud = require('../config/cloudinary');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/profile/:userId', ensureLoggedIn("/login"), (req, res, next) => {
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
          if (req.user.id === req.params.userId) {
            const owner = "owner"
            res.render("auth/profile", { user, position, owner })
          } else {
            res.render("auth/profile", { user, position })
          }
        })
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

router.get('/editprofile/:userId', ensureLoggedIn("/login"), (req, res, next) => {
  if (user.id === req.params.userId) {
    User.findById(req.params.userId)
      .then(user => {
        res.render("auth/editprofile", { user })
      })
      .catch(err => res.json(err))
  } else {
    res.redirect("/ranking")
  }
})

router.post('/editprofile/:userId', ensureLoggedIn("/login"), uploadCloud.single('photo'), (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmpassword = req.body.confirmpassword

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  userEdited = {}

  if (req.file === undefined) {
    userEdited.imagePath = user.imagePath
  } else {
    userEdited.imagePath = req.file.url
  }

  if (password === "") {
    userEdited.password = user.password
  } else {
    userEdited.password = hashPass;
  }
  if (password !== confirmpassword) {
    res.render("auth/editprofile", { message: "Confirm your password", user });
    return;
  }

  if (email === "") {
    userEdited.email = user.email;
  } else {
    userEdited.email = email;
  }

  User.findOne({ email }, "email", (err, userr) => {
    if (userr !== null) {
      res.render("auth/editprofile", { message: "The email already exists", user });
      return;
    }
  })
    .then(() => {
      User.findByIdAndUpdate(req.params.userId, userEdited)
        .then(user => {
          res.redirect(`/profile/${user.id}`)
        })
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

router.get('/ranking', ensureLoggedIn("/login"), (req, res, next) => {
  User.find({}, ["username", "points", "imagePath", "stadistics"]).sort({ 'points': -1 }).limit(20)
    .then(user => {
      res.render("auth/ranking", { user })
    })
});

router.get('/stadistics', ensureLoggedIn("/login"), (req, res, next) => {
  User.find({}, "stadistics")
    .then(stadistics => {
      res.render("auth/stadistics", { stadistics })
    })
});

module.exports = router;