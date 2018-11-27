document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.content-box');

  let questions = [];

  // var c = 0;
  // var time = 50 //ms per step
  // var steps = 4 //pasos en tu animación

  // var intervalID = setInterval(function () {
  //   c++;
  //   console.log(c);

  //   if (c === 1)	addClass(document.querySelector('.content-box'), 'rotatingPositive')
  //   if (c === 2)	{ // Cambio DOM
      
  //   }
  //   if (c === 3)	addClass(document.querySelector('.content-box'), 'rotatingNegative')
  //   //if (c === 4)	//eliminación de clase css sobrante o innecesaria

  //   console.log(c)

  //   if (c === 4)	clearInterval(intervalID)
  // }, steps * time)



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

    console.log(config)

    axios.post("/getquestions", config)
      .then(response => {
        if (!response.data.results.length) {
          document.querySelector('.error-message').innerHTML = "Cant find questions";
        } else if (response.data.message === undefined) {
          console.log(response.data.results);

          questions = response.data.results;

          initGame();
        } else {
          document.querySelector('.error-message').innerHTML = response.data.message;
        }
      })
      .catch(err => console.log("Error: ", err))
  })

  function initGame(questions) {
    removeClass(card, 'rotatingNegative');
    addClass(card, 'rotatingPositive');

    round();
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
    let html = `
      <div class="question">
        <p class="title">${question.question}</p>
        <div class="responses">
    `;

    switch (question.type) {
      case 'multiple':
        html += 'multiple';
        break;

      case 'boolean':
        html += 'boolean';
        break;
    }

    html += `</div></div>`;

    return html;
  }

  function round() {
    setTimeout(() => {
      console.log(questions)
      card.innerHTML = generateHTML(questions[0]);
      addClass(card, 'rotatingNegative');
      removeClass(card, 'rotatingPositive');

    }, 200);
  }

}, false);
