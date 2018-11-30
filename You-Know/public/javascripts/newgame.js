document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.content-box');
  let gameId;
  let gameData
  let questions = [];

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
    console.log(question);
    const category = getCategoryName(question.category)
    let html = `<div class="questionInfo"><p class="category">${category}</p><p class="difficulty">${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</p></div>`

    html += `<div class="rounds"><p>Round ${gameData.questionsAnswered} of ${gameData.numberQuestions}</p></div>`;

    html += `
      <div class="question" data-id="${question['_id']}">
        <p class="title">${question.question}</p>
        <div class="responses">
    `;
    question.answers.forEach(answer => {
      html += `<button class="button small simple" data-id="${answer['_id']}">${answer.value}</button>`;
    })
    

    html += `</div><p><a class="link" href="/main">Back to home</a></p></div>`;

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

          if (result.data.result) {
            correct();
          } else {
            incorrect();
          }
        })
    }

  }

  function correct() {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      card.innerHTML = "<p>Correct!</p>";
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

      setTimeout(() => {
        round()
      }, 400);

    }, 200);
  }

  function incorrect() {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      card.innerHTML = "<p>Incorrect!</p>";
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

      setTimeout(() => {
        round()
      }, 400);

    }, 200);
  }

  function gameFinish() {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    setTimeout(() => {
      card.innerHTML = `<p>Finished!</p>
      <p>Resume:</p>
      <p>Correct questions: ${gameData.questionsCorrect}</p>
      <p>Failed questions: ${gameData.questionsFailed}</p>
      <p>Accumulated points: ${gameData.points}</p>
      <p><a class="link" href="/game">New game</a></p>
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
    console.log(find);
    return find;
  }

}, false);
