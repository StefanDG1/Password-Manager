// function to change bg-color of selected card element

let divItems = document.getElementsByClassName("card");

function selected(item) {
    this.clear();
    item.classList.add('current-selection');
}

function clear() {
    for(var i=0; i < divItems.length; i++) {
        var item = divItems[i];
            item.classList.remove('current-selection');
    }
}

// code to create div card elements from database file and filter results based on search bar

const userCardTemplate = document.querySelector("[card-template]")
const userCardContainer = document.querySelector("[user-cards-container]")
const searchInput = document.querySelector("[search-box]")

let users = []

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  console.log(value)
  users.forEach(user => {
    const isVisible = user.title.toLowerCase().includes(value) || user.email.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  })
})

fetch("./database.json")
  .then(res => res.json())
  .then(data => {
    users = data.map(user => {
      const card = userCardTemplate.content.cloneNode(true).children[0]
      const title = card.querySelector("[card-title]")
      const email = card.querySelector("[card-email]")
      title.textContent = user.title
      email.textContent = user.email
      userCardContainer.append(card)
      return { title: user.title, email: user.email, element: card }
    })
  })