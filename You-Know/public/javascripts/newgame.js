document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.content-box');
  let gameId;
  let gameData
  let questions = [];
  const configTime = 15;
  let theTime = configTime
  let intervalId;

  axios.get("/categories")
    .then(categories => {
      const categorySelect = document.getElementById("category");

      categories.data.forEach(category => {
        let option = document.createElement("option");
        option.text = category.name;
        option.value = category._id;
        categorySelect.add(option);
      });
    })
    .catch(err => console.log("Error: ", err))

  document.getElementById('new-game').onsubmit = (e => {
    e.preventDefault();
    document.querySelector('.error-message').innerHTML = "";

    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const rounds = document.querySelector('input[name="rounds"]:checked').value;
    const categoryId = document.getElementById("category").value;

    const config = { difficulty, rounds, categoryId };

    axios.post("/creategame", config)
      .then(response => {
        gameId = response.data.created._id;
        round();
      })
      .catch(err => console.log("Error: ", err))
  })

  function printQuestion(question) {
    const html = generateHTML(question);

    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      card.innerHTML = html;
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

      createEvents();

    }, 200);


  }

  function round() {
    axios.get(`/game/${gameId}`)
      .then(game => {
        gameData = game.data
        if (game.data.numberQuestions === game.data.questionsAnswered) {
          gameFinish();
        } else {
          return axios.get(`/question/${game.data.category}/${game.data.difficulty}`)
          
        }

      })
      .then(question => {
        printQuestion(question.data);
        crono();
        return;
      })


  }


  function addClass(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }

  function removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  function generateHTML(question) {
    //console.log(question);
    const category = getCategoryName(question.category);
    changeBodyClass(category);
    let html = `<div class="time"><p>${theTime}</p></div>`

    html += `<div class="questionInfo"><p class="category">${category}</p><p class="difficulty">${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</p></div>`

    html += `<div class="rounds"><p>Round ${gameData.questionsAnswered + 1} of ${gameData.numberQuestions}</p></div>`;

    html += `
      <div class="question" data-id="${question['_id']}">
        <p class="title">${question.question}</p>
        <div class="responses">
    `;
    question.answers.forEach(answer => {
      html += `<button class="button small simple" data-id="${answer['_id']}">${answer.value}</button>`;
    })


    html += `</div><p><a class="link linkingame" href="/main">Back to home</a></p></div>`;

    return html;
  }


  function createEvents() {
    document.querySelectorAll('.responses button').forEach(button => {
      button.onclick = checkQuestion;
    })

    function checkQuestion(e) {
      const config = {
        answerId: e.target.getAttribute('data-id'),
        questionId: document.querySelector('.question').getAttribute('data-id'),
        answer: e.target.innerHTML,
        gameId
      };

      e.target.removeEventListener(e.type, arguments.callee);


      axios.post('/checkquestion', config)
        .then(result => {
          //console.log(result)

          if (result.data.result) {
            correct();
          } else {
            console.log(result.data.correct)
            incorrect(result.data.correct);
          }
        })
    }

  }

  function correct() {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      document.querySelector('body').className = 'round correct';
      card.innerHTML = "<div class='questionresult'><p>Correct!</p><img src='/images/icons/like.svg'></div>";
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');
      
      setTimeout(() => {
        stopInterval()
        round()
      }, 400);

    }, 300);
  }

  function incorrect(correct) {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      document.querySelector('body').className = 'round incorrect';
      card.innerHTML = `
      <div class='questionresult'>
        <p>Incorrect!</p>
        <img src='/images/icons/dislike.svg'>

        <p class="correctanswer">Correct Answer<span>${correct}</span></p>
        
      </div>`;
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

      setTimeout(() => {
        stopInterval()
        round()
      }, 400);

    }, 500);
  }

  function gameFinish() {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      document.querySelector('body').className = '';
      card.innerHTML = `<p class="completed">Complete!</p>
      <p class="total"><span class="label">Total answered:</span> <span class="number">${gameData.questionsCorrect + gameData.questionsFailed}</span></p>
      <p class="questions"><span class="label">Correct:</span> <span class="number">${gameData.questionsCorrect}</span></p>
      <p class="questions"><span class="label">Failed:</span> <span class="number">${gameData.questionsFailed}</span></p>
      <p class="points"><span class="label">Points</span><span class="number">${gameData.points}</span></p>
      <p><a class="button newgame" href="/game">New game</a></p>
      <p><a class="link" href="/main">Back to home</a></p>
      `;
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

    }, 600);
  }

  function getCategoryName(category) {
    const categories = {
      general: ['General', 'General Knowledge'],
      entertainment: ['Entertainment', 'Entertainment: Books', 'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Musicals & Theatres', 'Entertainment: Television', 'Entertainment: Video Games', 'Entertainment: Board Games', 'Celebrities', 'Entertainment: Comics', 'Entertainment: Japanese Anime & Manga', 'Entertainment: Cartoon & Animations'],
      science: ['Science & Nature', 'Science & Nature', 'Science: Computers', 'Science: Mathematics', 'Science: Gadgets', 'Animals', 'Vehicles'],
      art: ['Art'],
      historyAndGeography: ['History & Geography', 'History', 'Geography', 'Politics', 'Mythology'],
      sports: ['Sports']
    }
    let find;

    for (let key in categories) {
      if (categories[key].includes(category)) find = categories[key][0];
    }
    //console.log(find);
    return find;
  }

  function changeBodyClass(category) {
    //console.log(category)
    switch (category) {
      case 'General':
        document.querySelector('body').className = 'round general';
        break;

      case 'Entertainment':
        document.querySelector('body').className = 'round entertainment';
        break;

      case 'Science & Nature':
        document.querySelector('body').className = 'round science';
        break;

      case 'Art':
        document.querySelector('body').className = 'round art';
        break;

      case 'History & Geography':
        document.querySelector('body').className = 'round history';
        break;

      case 'Sports':
        document.querySelector('body').className = 'round sports';
        break;


    }
  }

  function crono() {
    intervalId = setInterval(function () {
      theTime--;
      document.querySelector('.time p').innerHTML = theTime;
      console.log(theTime)
      if (theTime === 0) {
        stopCronoAndFail()
      }
    }, 1000)
  }

  function stopCronoAndFail() {
    const config = {
      answerId: '5c01238fb359b81088f88082',
      questionId: document.querySelector('.question').getAttribute('data-id'),
      answer: 'Loft',
      gameId
    };


    axios.post('/checkquestion', config)
      .then(result => {

        if (result.data.result) {
          correct();
        } else {
          incorrect();
        }
      })



    }
    
    function stopInterval() {
      theTime = configTime;
      clearInterval(intervalId)
  }

}, false);
