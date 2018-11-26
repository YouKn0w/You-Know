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

    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const rounds = document.querySelector('input[name="rounds"]:checked').value;
    const categoryid = document.getElementById("category").value;

    const config = {difficulty, rounds, categoryid};
    
    console.log(config)

    axios.post("http://localhost:3000/getquestions", config)
      .then(questions => {
        console.log(questions)
      })
      .catch(err => console.log("Error: ", err))



  })

}, false);
