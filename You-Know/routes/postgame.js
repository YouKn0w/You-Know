const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const User = require("../models/User");
const Game = require("../models/Game");

const axios = require('axios');
const lodash = require('lodash');

router.post("/creategame", (req, res, next) => {
  const userId = req.body.userId;
  const category = req.body.category;
  const difficulty = req.body.difficulty;
  const numberQuestions = req.body.numberquestions;

  User.findById(userId)
    .then((user) => {
      const userIdd = user.id
      let game = {
        userIdd,
        category,
        difficulty,
        numberQuestions,
        questionsAnswered: 0,
        questionsCorrect: 0,
        questionsFailed: 0,
        points: 0
      }

      Game.create(game)
        .then(created => {
          res.json({ created })
        })
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

router.post('/checkquestion', (req, res, next) => {
  const questionId = req.body.questionId;
  const userId = req.body.userId;
  const answer = req.body.answer;

  Question.findById(questionId)
    .then(question => {

      if (question['correct_answer'] === answer) {

        let pointsToAdd;
        switch (question.difficulty) {
          case 'easy':
            pointsToAdd = 1;
            break;
          case 'medium':
            pointsToAdd = 2;
            break;
          case 'hard':
            pointsToAdd = 3;
            break;
        }

        console.log(pointsToAdd)

        return User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } })


      } else {
        res.json({ result: false })
      }

    })
    .then(result => {
      console.log('sumado');
      res.json({ result: true, points: pointsToAdd })
    })
    .catch(err => res.json(err))

})

module.exports = router;