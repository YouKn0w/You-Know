document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.content-box');
  let gameId;

  let questions = [];

  axios.get("/getcategories")
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

    //console.log(config)

    axios.post("/creategame", config)
      .then(response => {
        gameId = response.data.created._id;
        return axios.get(`/question/${response.data.created.category}/${response.data.created.difficulty}`)

      })
      .then(question => {
        printQuestion(question.data);
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
    console.log('ronda');
    axios.get(`/game/${gameId}`)
      .then(game => {
        console.log(game.data)
        if (game.data.numberQuestions === game.data.questionsAnswered) {
          gameFinish();
        } else {
          axios.get(`/question/${game.data.category}/${game.data.difficulty}`)
            .then(question => {
              printQuestion(question.data);
              return;
            })
        }

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
    let html = `
      <div class="question" data-id="${question['_id']}">
        <p class="title">${question.question}</p>
        <div class="responses">
    `;
    question.answers.forEach(answer => {
      html += `<button data-id="${answer['_id']}">${answer.value}</button>`;
    })
    

    html += `</div></div>`;

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

          console.log('result', result.data.result);
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
      card.innerHTML = "<p>Finished!</p>";
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

    }, 600);
  }

}, false);
