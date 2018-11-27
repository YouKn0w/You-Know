const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const Game = require("../models/Game");
const axios = require('axios');
const lodash = require('lodash');

router.get('/categories', (req, res, next) => {
  Category.find({}, "name")
    .sort('name')
    .then((categories) => {
      res.json(categories)
    })
    .catch(err => console.log(err))
});

router.get('/category/:id', (req, res, next) => {
  let categoryapi = +req.params.id
  Category.find({ categoryApiId: categoryapi })
    .then((category) => {
      const categoryname = category[0].name
      res.json({ categoryname })
    })
    .catch(err => console.log(err))
});

router.get('/game/:gameId', (req, res, next) => {
  Game.findById(req.params.gameId)
    .then((game) => {
      res.json(game)
    })
    .catch(err => console.log(err))
});

router.get('/question/:categoryId/:difficulty', (req, res, next) => {
  // if (!['any', 'easy', 'medium', 'hard'].includes(req.body.difficulty)) {
  //   res.json({ message: 'Try again' })
  //   return;
  // }

  // if (!['10', '30', '50'].includes(req.body.rounds)) {
  //   res.json({ message: 'Try again' })
  //   return;
  // }
  Category.findById(req.params.categoryId)
    .then(result => {
      const urlBase = 'https://opentdb.com/api.php?';
      const difficulty = (req.params.difficulty === 'any') ? '' : `&difficulty=${req.params.difficulty}`;
      if (result.name !== 'any') {

        const apiIds = result.categoryApiId;

        let question = apiIds[Math.floor(Math.random() * apiIds.length)]

        const url = `${urlBase}category=${question}&amount=1${difficulty}`;


        axios.get(url)
          .then(result => {
            Question.create(result.data.results[0])
              .then((question) => {
                let answers = question.incorrect_answers
                answers.push(question.correct_answer)
                answers = lodash.shuffle(answers);

                const quest = {
                  id: question._id,
                  question: question.question,
                  answers: answers
                }

                res.json(quest)
              })
              .catch(err => console.log('Error: ', err))
          })
          .catch(err => console.log('Error: ', err))
      } else {
        axios.get(`${urlBase}amount=1${difficulty}`)
          .then(result => {
            Question.create(result.data.results[0])
              .then((question) => {
                let answers = question.incorrect_answers
                answers.push(question.correct_answer)
                answers = lodash.shuffle(answers);

                const quest = {
                  id: question._id,
                  question: question.question,
                  answers: answers
                }

                res.json(quest)
              })
              .catch(err => console.log('Error: ', err))
          })
      }
    })
})


module.exports = router;