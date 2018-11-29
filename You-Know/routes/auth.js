const express = require("express");
const passport = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const transporter = require('../mail/transporter');
const uploadCloud = require('../config/cloudinary');
const cloudinary = require('cloudinary');
const jdenticon = require("jdenticon"),
  fs = require("fs");
const router = express.Router();
const User = require("../models/User");

jdenticon.config = {
  lightness: {
    color: [0.23, 0.87],
    grayscale: [0.38, 0.66]
  },
  saturation: {
    color: 0.74,
    grayscale: 0.33
  },
  backColor: "#86444400"
};

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', ensureLoggedOut("/main"), (req, res, next) => {
  res.render('index');
});

router.get("/login", ensureLoggedOut("/main"), (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/main",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", ensureLoggedOut("/main"), (req, res, next) => {
  res.render("auth/signup");
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  User.findOneAndUpdate({ confirmationCode: req.params.confirmCode }, { $set: { status: "Active" } }, { new: true })
    .then(() => {
      res.redirect("/login");
    })
    .catch(err => console.log(err));
});

router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  const username = req.body.username;
  const password = req.body.password;
  const confirmPass = req.body.confirmpassword;
  const email = req.body.email;

  if (username === "") {
    res.render("auth/signup", { message: "Indicate an username" });
    return;
  }

  if (password === "") {
    res.render("auth/signup", { message: "Indicate a password" });
    return;
  } else if (password !== confirmPass) {
    res.render("auth/signup", { message: "Confirm your password" });
    return;
  }

  if (email === "") {
    res.render("auth/signup", { message: "Indicate an email" });
    return;
  }

  const png = jdenticon.toPng(username, 100);
  fs.writeFileSync(`${username}.png`, png);

  cloudinary.uploader.upload(`${username}.png`,
    function (result) {

      fs.unlink(`${username}.png`, function (err) {
        if (err) throw err;
      });

      const imagePath = (req.file === undefined) ? result.url : req.file.url;

      const confirmationCode = token;

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
            imagePath,
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
          <a href="https://youkn0w.herokuapp.com/confirm/${confirmationCode}">Confirm your email here, for activate your account & can access in our WebSite!<a>
          `,
              })
                .then(() => res.redirect("/login"))
                .catch(err => console.log(err));
            })
            .catch(err => {
              res.render("auth/signup", { message: "Something went wrong, try again or wait, thanks and sorry for issues" });
            })
        })
    }, { public_id: Date.now(), folder: 'youknow' })
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
