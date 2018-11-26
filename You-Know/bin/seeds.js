require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const Category = require('../models/Category');
const Game = require('../models/Game');
const Question = require('../models/Question');
mongoose.connect(`mongodb://${process.env.DB}`);

const passwords = ["y", "z"];
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users = [
  {
    username: "y",
    password: bcrypt.hashSync(passwords[0], salt),
    email: "asdasdasdasdasd@gmail.com",
    imagePath: "https://res.cloudinary.com/yunevk/image/upload/v1543235622/youknow/pocoyo.png.png",
    status: "Active",
    confirmationCode: "rliucne4o59439cct3475c4",
    points: 524,
    stadistics: {
      general: {
        correct: 20,
        failed: 10
      },
      entertainment: {
        correct: 60,
        failed: 25
      },
      science: {
        correct: 2,
        failed: 50
      },
      art: {
        correct: 90,
        failed: 24
      },
      historyAndGeography: {
        correct: 27,
        failed: 94
      },
      sports: {
        correct: 46,
        failed: 67
      },
      ironhack: {
        correct: 32,
        failed: 42
      }
    }
  },
  {
    username: "z",
    password: bcrypt.hashSync(passwords[1], salt),
    email: "dsgsdgdfgdsgresdg@gmail.com",
    imagePath: "",
    status: "Active",
    confirmationCode: "328746sdkhfsdfgewu234bd",
    points: 200,
    stadistics: {
      general: {
        correct: 12,
        failed: 10
      },
      entertainment: {
        correct: 20,
        failed: 10
      },
      science: {
        correct: 33,
        failed: 42
      },
      art: {
        correct: 21,
        failed: 45
      },
      historyAndGeography: {
        correct: 11,
        failed: 14
      },
      sports: {
        correct: 6,
        failed: 2
      },
      ironhack: {
        correct: 12,
        failed: 45
      }
    }
  }
]

const categories = [
  {
    name: "any",
    categoryApiId: [9, 28, 10, 11, 12, 13, 14, 15, 16, 26, 29, 31, 32, 17, 18, 19, 30, 27, 25, 23, 22, 24, 20, 21]
  },
  {
    name: "general",
    categoryApiId: [9, 28]
  },
  {
    name: "entertainment",
    categoryApiId: [10, 11, 12, 13, 14, 15, 16, 26, 29, 31, 32]
  },
  {
    name: "science",
    categoryApiId: [17, 18, 19, 30, 27]
  },
  {
    name: "art",
    categoryApiId: [25]
  },
  {
    name: "historyAndGeography",
    categoryApiId: [23, 22, 24, 20]
  },
  {
    name: "sports",
    categoryApiId: [21]
  }
]

const games = [
  {
    answeredQuestions: 5,
    totalQuestions: 10,
    difficulty: "easy",
    points: 5
  },
  {
    answeredQuestions: 25,
    totalQuestions: 50,
    difficulty: "hard",
    points: 125
  }
]

const questions = [
  {
    category: "ironhack",
    type: "multiple",
    difficulty: "easy",
    question: "Who is the Teach leader in web?",
    correct_answer: "Vicario",
    incorrect_answers: ["Gabi", "Juan", "Teo"]
  },
  {
    category: "ironhack",
    type: "multiple",
    difficulty: "medium",
    question: "How much time is full time bootcamp?",
    correct_answer: "9 weeks",
    incorrect_answers: ["6 months", "9 months", "10 weeks"]
  }
]

User.create(users)
  .then(() => {
    console.log(`Created ${users.length} users`)
    return Category.create(categories)
  })
  .then(() => {
    console.log(`Created ${categories.length} categories`)
    return Game.create(games)
  })
  .then(() => {
    console.log(`Created ${games.length} games`)
    return Question.create(questions)
  })
  .then(() => {
    console.log(`Created ${questions.length} questions`)
    mongoose.connection.close()
  })
  .catch(err => console.log(err))