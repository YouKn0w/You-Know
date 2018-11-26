document.addEventListener('DOMContentLoaded', () => {

  console.log('New Game Loaded');

  document.getElementById('new-game').onsubmit = (e => {
    e.preventDefault();

    axios.get("http://localhost:8000/getcategories")
      .then(categories => {
        console.log(categories);
      })
      .catch(err => console.log("Error: ", err))
  })

}, false);
