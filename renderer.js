// function to change bg-color of selected card element

let divItems = document.getElementsByClassName("card");

const infoContainer = document.getElementsByClassName("info-container")[0];
const infoIcon = infoContainer.getElementsByClassName("info-icon-pic")[0]
const infoTitle = infoContainer.getElementsByClassName("info-title")[0]
const infoWebsite = infoContainer.getElementsByClassName("info-website")[0]
const infoUsername = infoContainer.getElementsByClassName("info-username")[0]
const infoEmail = infoContainer.getElementsByClassName("info-email")[0]
const infoPassword = infoContainer.getElementsByClassName("info-password")[0]
const infoGroup = infoContainer.getElementsByClassName("info-group")[0]
const infoNotes = infoContainer.getElementsByClassName("info-notes")[0]


function selected(item) {
    infoContainer.style.display = "flex";
    this.clear();
    console.log(item);
    item.classList.add('current-selection');
    let currentlySelected = {};
    for (let i = 0; i < divItems.length; i++) {
      if (item.identifier == entries[i].id) {
        currentlySelected = entries[i];
      }
    }
    console.log(currentlySelected);
    infoIcon.src = currentlySelected.icon;
    infoTitle.textContent = currentlySelected.title;
    infoWebsite.textContent.append = currentlySelected.website;
    infoUsername.textContent = currentlySelected.username;
    infoEmail.textContent = currentlySelected.email;
    infoPassword.textContent = currentlySelected.password;
    infoGroup.textContent = currentlySelected.group;
    infoNotes.textContent = currentlySelected.notes;
}

function clear() {
    for(let i=0; i < divItems.length; i++) {
        let item = divItems[i];
            item.classList.remove('current-selection');
    }
}

function closeInfo() {
  infoContainer.style.display = "none";
}

// code to create div card elements from database file and filter results based on search bar

const userCardTemplate = document.querySelector("[card-template]")
const userCardContainer = document.querySelector("[user-cards-container]")
const searchInput = document.querySelector("[search-box]")

// entries are all the database entries


// filter through search results

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  entries.forEach(entry => {
    const isVisible = entry.title.toLowerCase().includes(value) || entry.email.toLowerCase().includes(value)
    entry.element.classList.toggle("hide", !isVisible)
  })
})

// fetch data from database and map each entry so that you make a new card with title
// and email info from template

let entries = []
fetch("./database.json")
  .then(res => res.json())
  .then(data => {
    entries = data.map(entry => {
      const card = userCardTemplate.content.cloneNode(true).children[0]
      const email = card.querySelector("[card-email]")
      const image = card.querySelector("[card-icon]")
      const title = card.querySelector("[card-title]")
      card.identifier = entry.id
      image.src = entry.icon
      title.textContent = entry.title
      email.textContent = entry.email
      
      userCardContainer.append(card)
      return { id: entry.id, title: entry.title, username: entry.username, 
        email: entry.email, password: entry.password, website: entry.website, notes: entry.notes,
        icon: entry.icon, group: entry.group, element: card }
    })
  })
