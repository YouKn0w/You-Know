const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const User = require("../models/User");
const Game = require("../models/Game");
const Answer = require("../models/Answer");

const axios = require('axios');
const lodash = require('lodash');

let pointsToAdd

router.post("/creategame", ensureLoggedIn("/login"), (req, res, next) => {
  const userId = req.user._id;
  const category = req.body.categoryId;
  const difficulty = req.body.difficulty;
  const numberQuestions = req.body.rounds;

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

router.post('/checkquestion', ensureLoggedIn("/login"), (req, res, next) => {
  const userId = req.user._id;
  const { questionId, answer, answerId, gameId } = req.body;
  let category;
  let correct;

  Answer.findById(answerId)
    .then(answer => {
      //correct = answer.correct;

      if (answer.correct === true) {

        Question.findById(questionId)
          .then(question => {

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

            return User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd } })


          })
          .then(result => {
            return Game.findByIdAndUpdate(gameId, { $inc: { questionsAnswered: 1, questionsCorrect: 1, points: pointsToAdd } })
          })
          .then(game => {
            return Question.findById(questionId)
          })
          .then(question => {
            category = getCategoryName(question.category);
            return User.findById(userId)
          })
          .then(user => {

            user.stadistics[category].correct++;

            user.save(function (err) {
              res.json({ result: true })
              return;
            });


          })
          .catch(err => console.log(err))


      } else {
        return Game.findByIdAndUpdate(gameId, { $inc: { questionsAnswered: 1, questionsFailed: 1 } })
          .then(game => {

            return Question.findById(questionId)
          })
          .then(question => {
            category = getCategoryName(question.category);
            return User.findById(userId)
          })
          .then(user => {
            user.stadistics[category].failed++;
            user.save(function (err) {
              Question.findById(questionId).populate('answers')
              .then(questions => {
                questions.answers.forEach(answer => {
                  if (answer.correct) {
                    correct = answer.value;
                    res.json({ result: false, correct })
                    return;
                  } 
                })
            
              })
              .catch(err => console.log(err))
            });
          })
          
      }
    })

    .catch(err => console.log(err))


})

function getCategoryName(category) {
  const categories = {
    general: ['General Knowledge'],
    entertainment: ['Entertainment: Books', 'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Musicals & Theatres', 'Entertainment: Television', 'Entertainment: Video Games', 'Entertainment: Board Games', 'Celebrities', 'Entertainment: Comics', 'Entertainment: Japanese Anime & Manga', 'Entertainment: Cartoon & Animations'],
    science: ['Science & Nature', 'Science: Computers', 'Science: Mathematics', 'Science: Gadgets', 'Animals', 'Vehicles'],
    art: ['Art'],
    historyAndGeography: ['History', 'Geography', 'Politics', 'Mythology'],
    sports: ['Sports']
  }
  let find;

  for (let key in categories) {
    if (categories[key].includes(category)) find = key;
  }
  return find;
}

module.exports = router;