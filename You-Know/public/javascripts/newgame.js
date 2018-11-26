document.addEventListener('DOMContentLoaded', () => {

  axios.get("http://localhost:3000/getcategories")
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

    const config = {difficulty, rounds, categoryId};
    
    console.log(config)

    axios.post("http://localhost:3000/getquestions", config)
      .then(questions => {
        console.log(questions)
        console.log(questions.data.results.length)
        if (!questions.data.results.length) {
          document.querySelector('.error-message').innerHTML = "No se han encontrado preguntas";
        } else if (questions.data.message === undefined) {
          console.log(questions)
        } else {
          document.querySelector('.error-message').innerHTML = questions.data.message;
        }
      })
      .catch(err => console.log("Error: ", err))



  })

}, false);
