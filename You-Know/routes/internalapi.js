const express = require("express");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router = express.Router();
const Category = require("../models/Category");

const axios = require('axios');
const lodash = require('lodash');

router.get('/getcategories', ensureLoggedIn("/login"), (req, res, next) => {
  Category.find({}, "name")
    .sort('name')
    .then((categories) => {
      res.json(categories)
    })
    .catch(err => console.log(err))
});

router.post('/getquestions', ensureLoggedIn("/login"), (req, res, next) => {
  if (!['any', 'easy', 'medium', 'hard'].includes(req.body.difficulty)) {
    res.json({message: 'Inténtalo otra vez'})
    return;
  }
  
  if (!['10', '30', '50'].includes(req.body.rounds)) {
    res.json({message: 'Inténtalo otra vez'})
    return;
  }

  difficulty = (req.body.difficulty === 'any') ? '' : `&difficulty=${req.body.difficulty}`;
  rounds = req.body.rounds;
  console.log(typeof rounds)
  categoryId = req.body.categoryId;

  const urlBase = 'https://opentdb.com/api.php?';

  

  Category.findById(categoryId)
    .then(result => {
      if (result.name !== 'any') {
        
        const apiIds = result.categoryApiId;
        let typeQuestions = [];
  
        for (let i = 0; i < rounds; i++) {
  
          typeQuestions.push(apiIds[Math.floor(Math.random() * apiIds.length)])
        }
  
        typeQuestions = lodash.groupBy(typeQuestions);

        let petitions = [];

        for (let key in typeQuestions) {
          const url = `${urlBase}amount=${typeQuestions[key].length}&category=${typeQuestions[key][0]}${difficulty}`;
          petitions.push(axios.get(url))
        }

        let results = [];

        axios.all(petitions)
          .then(result => {
            result.forEach(element =>{

              element.data.results.forEach(element => {
                results.push(element);
              })
            })

            results = lodash.shuffle(results);

            res.json({results});
          })
          .catch(err => console.log('Error: ', err))
      } else {
        console.log('Any');
        axios.get(`${urlBase}amount=${rounds}${difficulty}`)
          .then(result => {
            const results = result.data.results;
            res.json({results});
          })
      }
    })


});

module.exports = router;