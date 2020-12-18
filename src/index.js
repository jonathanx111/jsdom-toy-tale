let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // render toys
  function fetchToys() {
    fetch("http://localhost:3000/toys") 
    .then(response => response.json())
    .then(data => renderToys(data))
    // .then(data => (data.forEach()))
  //   <div class="card">
  //   <h2>${toy.name}</h2>
  //   <img src=${toy.image}class="toy-avatar" />
  //   <p>${} Likes </p>
  //   <button class="like-btn">Like <3</button>
  // </div>
    
  }
  fetchToys()
  
  function renderToys(toysJson) {
    toysJson.forEach(appendToy)
  }
  
  const existingToyCollection = document.querySelector('#toy-collection')
  function appendToy(toy) {
    const cardDiv = document.createElement('div')
    const cardH2 = document.createElement('h2')
    const cardImg = document.createElement('img')
    const cardP = document.createElement('p')
    const cardButton = document.createElement('button')
    const deleteButton = document.createElement('button')
  
    cardDiv.className = "card"
  
    cardH2.textContent = toy.name
  
    cardImg.src = toy.image 
    cardImg.className = "toy-avatar"
  
    cardP.textContent = `${toy.likes} likes `
  
    cardButton.className = "like-btn"
    cardButton.textContent = "Like"
    cardButton.dataset.toyId = toy.id
  
    deleteButton.className = 'delete-btn'
    deleteButton.textContent = "Delete Toy :("
    deleteButton.dataset.toyId = toy.id
  
    cardDiv.append(cardH2, cardImg, cardP, cardButton, deleteButton)
    existingToyCollection.append(cardDiv)
  }
  
  // New Toys
  const newToyForm = document.querySelector('.add-toy-form')
  const newToyBtn = document.querySelector('.submit')
  
  newToyForm.addEventListener('submit', addToy)
  
  function addToy(e) {
    e.preventDefault()
    
    const newToyObject = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }
  
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newToyObject),
    })
      .then((response) => response.json())
      .then((actualNewToyFromTheServer) => {
        console.log("Success:", actualNewToyFromTheServer);
        // and slap the new post on the DOM
        appendToy(actualNewToyFromTheServer);
      });
  
      console.log(newToyObject)
      e.target.reset()
  }
  
  // Likes Button
  
  const likeBtn = document.querySelector('.like-btn')
  const headers = {headers: {
    "Content-Type": "application/json",
  }}
  existingToyCollection.addEventListener('click', function(e) {
  if (e.target.matches(".like-btn")) {
    const id = e.target.dataset.toyId 
    const toyDiv = e.target.closest("div.card")
    const likesPtag = toyDiv.querySelector('p')
    const numOfLikes = parseInt(likesPtag.textContent) + 1
  
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: numOfLikes,
      }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        console.log(updatedToy);
        // pessimists!
        likesPtag.textContent = `${updatedToy.likes} likes`;
      });
      // likesPtag.textContent = numOfLikes
  } else if (e.target.matches(".delete-btn")) {
    const id = e.target.dataset.toyId 
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "DELETE",
    });
    const toyDiv = e.target.closest("div.card")
    toyDiv.remove()
  }
  })
})
