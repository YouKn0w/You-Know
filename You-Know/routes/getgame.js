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
      //console.log('category', result.name)
      if (result.name !== 'any') {
        //console.log(result.categoryApiId)
//
        const apiIds = result.categoryApiId;

        let question = apiIds[Math.floor(Math.random() * apiIds.length)]
        question += '';

        //console.log(typeof question)

        url = `${urlBase}amount=1${difficulty}`;   
        //url = `${urlBase}category=${question}&amount=1${difficulty}`;
        //console.log(url)
        return axios.get(url)
        
      } else {
        url = `${urlBase}amount=1${difficulty}`;    
        return axios.get(url)    
      }
      
      console.log(url)
      //return axios.get(`${urlBase}amount=1${difficulty}`)
      return axios.get(url)
    })
    .then(result => {
      //console.log('get result')
      //console.log(result.data)
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
      //console.log('get answers', answers)

      let answersId = answers.map(answer => answer['_id']);

      //console.log(answersId)


      delete questionToMongo['correct_answer'];
      delete questionToMongo['incorrect_answers'];
      questionToMongo.answers = answersId;
      questionToMongo.answers = lodash.shuffle(questionToMongo.answers);

      //console.log('questionToMongo', questionToMongo)
      //res.json({questionToMongo})
      return Question.create(questionToMongo)
    })
    .then((questions) => {
      //console.log('get question')
      return Question.findById(questions['_id']).populate({path: 'answers', select: '_id'}).populate({path: 'answers', select: 'value'})

    })
    .then(result => {
      //console.log('get result')
      res.json(result)
    })
    .catch(err => console.log)
})


module.exports = router;