const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");
const Question = require("../models/Question");
const User = require("../models/User");

const axios = require('axios');
const lodash = require('lodash');

router.post('/checkquestion', (req, res, next) => {
  const {questionId,userId,answer} = req.body;

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

        return User.findByIdAndUpdate(userId, { $inc: { points: pointsToAdd} })
      } else {
        res.json({result: false})
      }
      
    })
    .then(result => {
      res.json({result: true, points: pointsToAdd})
    })
    .catch(err => res.json(err))

})

module.exports = router;