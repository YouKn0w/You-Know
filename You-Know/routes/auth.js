const express = require("express");
const passport = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const transporter = require('../mail/transporter');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/main",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/main", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/main")
  }
});

router.get("/profile", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/profile", { user });
  }
});

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

router.get("/ranking", ensureLoggedIn("/login"), (req, res, next) => {
  user = req.user
  if (user.status !== "Active") {
    res.render("auth/login", { message: "This account isnt Activated" });
  } else {
    res.render("auth/ranking", { user });
  }
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { $set: { status: "Active" } }, { new: true })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
});

router.post("/signup", (req, res, next) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const confirmationCode = token;
  if (username === "") {
    res.render("auth/signup", { message: "Indicate an username" });
    return;
  }

  if (password === "") {
    res.render("auth/signup", { message: "Indicate a password" });
    return;
  }

  if (email === "") {
    res.render("auth/signup", { message: "Indicate an email" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
  })
    .then(() => {
      User.findOne({ email }, "email", (err, user) => {
        if (user !== null) {
          res.render("auth/signup", { message: "The email already exists" });
          return;
        }
      })
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        email,
        confirmationCode
      });

      newUser.save()
        .then(() => {
          transporter.sendMail({
            from: '"You💡Know Corporation" <labsandtests@gmail.com>',
            to: email,
            subject: 'Confirmation Email',
            text: 'Welcome to You💡Know',
            html: `<p>Welcome to You💡Know</p>
          <p>Your username is: ${username}</p>
          <a href="http://localhost:3000/confirm/${confirmationCode}">Confirm your email here, for activate your account & can access in our WebSite!<a>
          `,
          })
            .then(() => res.redirect("/login"))
            .catch(err => console.log(err));
        })
        .catch(err => {
          res.render("auth/signup", { message: "Something went wrong, try again or wait, thanks and sorry for issues" });
        })
    })
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
