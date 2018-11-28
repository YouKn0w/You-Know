const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const Game = require("../models/Game");
const Answer = require("../models/Answer");
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
  let url;
  let questionToMongo;
  let answers;

  Category.findById(req.params.categoryId)
    .then(result => {
      const urlBase = 'https://opentdb.com/api.php?';
      const difficulty = (req.params.difficulty === 'any') ? '' : `&difficulty=${req.params.difficulty}`;
      if (result.name !== 'any') {

        const apiIds = result.categoryApiId;

        let question = apiIds[Math.floor(Math.random() * apiIds.length)]

        url = `${urlBase}category=${question}&amount=1${difficulty}`;

      } else {
        url = `${urlBase}amount=1${difficulty}`;        
      }

      return axios.get(`${urlBase}amount=1${difficulty}`)
        
    })
    .then(result => {

      let objectAnswers = [
        {
          value: result.data.results[0].correct_answer, 
          correct: true
        }
      ];
      result.data.results[0].incorrect_answers.forEach(answer => {
        objectAnswers.push({
          value: answer, 
          correct: false
        });
      });

      questionToMongo = result.data.results[0];
      return Answer.insertMany(objectAnswers);
      
      
    })
    .then(answers => {
      let answersId = answers.map(answer => answer['_id']);


      delete questionToMongo['correct_answer'];
      delete questionToMongo['incorrect_answers'];
      questionToMongo.answers = answersId;

      
      return Question.create(questionToMongo)
    })
    .then((question) => {
      return Question.findById(question['_id']).populate({path: 'answers', select: '_id'}).populate({path: 'answers', select: 'value'})

    })
    .then(result => {
      res.json(result)
    })
    .catch(err => console.log)
})


module.exports = router;