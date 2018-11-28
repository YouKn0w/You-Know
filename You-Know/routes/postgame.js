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

router.post("/creategame", (req, res, next) => {
  const userId = req.user._id;
  const category = req.body.categoryId;
  const difficulty = req.body.difficulty;
  const numberQuestions = req.body.rounds;
  console.log(numberQuestions)

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
  const userId = req.user._id;
  const {questionId,answer, answerId, gameId} = req.body;
  let category;

  //console.log(questionId);

  Answer.findById(answerId)
    .then(answer => {
      //console.log('correct', answer.correct)

      if (answer.correct === true) {

        //console.log(true)

        Question.findById(questionId)
        .then(question => {
          //console.log('question', question);
    
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

          console.log(question)
    
          return User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd} })
          
    
        })
        .then(result => {
          return Game.findByIdAndUpdate(gameId, { $inc: { questionsAnswered: 1, questionsCorrect: 1} })
        })
        .then(game => {
          console.log(game);

          return Question.findById(questionId)
        })
        .then(question => {
          //console.log(question.category);
          category = getCategoryName(question.category);
          return User.findById(userId)
        })
        .then(user => {
          console.log(user.stadistics);

          user.stadistics[category].correct++;

          console.log(user.stadistics);

          user.save(function (err) {
            res.json({ result: true })
            return;
          });
          

        })
        .catch(err => console.log)


      } else {
        console.log(false)
        return Game.findByIdAndUpdate(gameId, { $inc: { questionsAnswered: 1, questionsFailed: 1} })
        .then(game => {
          console.log(game);

          return Question.findById(questionId)
        })
        .then(question => {
          //console.log(question.category);
          category = getCategoryName(question.category);
          return User.findById(userId)
        })
        .then(user => {
          console.log(user.stadistics);

          user.stadistics[category].failed++;

          console.log(user.stadistics);

          user.save(function (err) {
            res.json({ result: false })
            return;
          });
          

        })
        
      }

      //res.json({answer})
    })
    
    .catch(err => console.log)


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