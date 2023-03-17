// function to change bg-color of selected card element

let divItems = document.getElementsByClassName("card");

const infoContainer = document.getElementsByClassName("info-container")[0];
const infoIcon = infoContainer.getElementsByClassName("info-icon-pic")[0]
const infoTitle = infoContainer.getElementsByClassName("info-title")[0]
const infoWebsite = infoContainer.getElementsByClassName("info-website")[0]
const infoUsername = infoContainer.getElementsByClassName("info-username")[0]
const infoPassword = infoContainer.getElementsByClassName("info-password")[0]
const infoGroup = infoContainer.getElementsByClassName("info-group")[0]
const infoNotes = infoContainer.getElementsByClassName("info-notes")[0]
const infoCreated = infoContainer.getElementsByClassName("info-created")[0]
const infoModified = infoContainer.getElementsByClassName("info-modified")[0]


function selected(item) {
  infoContainer.style.display = "block";
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
  infoPassword.textContent = currentlySelected.password;
  infoGroup.textContent = currentlySelected.group;
  infoNotes.textContent = currentlySelected.notes;
  infoCreated.textContent = currentlySelected.dateCreated;
  infoModified.textContent = currentlySelected.lastModified;

}

function clear() {
  for (let i = 0; i < divItems.length; i++) {
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


// filter through search results on click, focus (with tab), or when writing

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  entries.forEach(entry => {
    const isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value)
    entry.element.classList.toggle("hide", !isVisible)
  })
})
searchInput.addEventListener("click", e => {
  const value = e.target.value.toLowerCase()
  entries.forEach(entry => {
    const isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value)
    entry.element.classList.toggle("hide", !isVisible)
  })
})
searchInput.addEventListener("focus", e => {
  const value = e.target.value.toLowerCase()
  entries.forEach(entry => {
    const isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value)
    entry.element.classList.toggle("hide", !isVisible)
  })
})

// fetch data from database and map each entry so that you make a new card with title
// and email info from template

let entries = [];

function retrieveData() {
  fetch("./database.json")
    .then(res => res.json())
    .then(data => {
      // reverse data array before mapping in order to get new db entries at the top and old at the bottom
      entries = data.reverse().map(entry => {
        const card = userCardTemplate.content.cloneNode(true).children[0]
        const username = card.querySelector("[card-username]")
        const image = card.querySelector("[card-icon]")
        const title = card.querySelector("[card-title]")
        card.identifier = entry.id
        image.src = entry.icon
        title.textContent = entry.title
        username.textContent = entry.username

        userCardContainer.append(card)
        return {
          id: entry.id,
          title: entry.title,
          username: entry.username,
          password: entry.password,
          website: entry.website,
          notes: entry.notes,
          icon: entry.icon,
          group: entry.group,
          dateCreated: entry.dateCreated,
          lastModified: entry.lastModified,
          element: card
        }
      })
    });
}

retrieveData();

// prototype function to add new user data and update the list of elements

function addNew() {
  let timeNow = currentTime();
  let usersjson = api.fs.readFileSync("database.json", "utf-8");
  let users = JSON.parse(usersjson);
  let newIndex = users[users.length - 1].id + 1;
  let obj = {
    "id": newIndex,
    "title": "New Entry",
    "username": "Prostul123",
    "password": "password123",
    "website": "www.youtube.com",
    "notes": "new entries",
    "icon": "./images/youtube.png",
    "group": "new entry group",
    "dateCreated": timeNow,
    "lastModified": timeNow,
  }
  users.push(obj);
  usersjson = JSON.stringify(users);
  api.fs.writeFileSync("database.json", usersjson, "utf-8");

  // empty card template and get data from database again to update list
  userCardContainer.replaceChildren();
  retrieveData();
}

function currentTime() {
  let today = new Date();
  let currentDay = today.getDate() + 1 < 10 ? '0' + today.getDate() : today.getDate();
  let currentMonth = today.getMonth() + 1 < 10 ? '0' + today.getMonth() : today.getMonth();
  let currentHours = today.getHours() + 1 < 10 ? '0' + today.getHours() : today.getHours();
  let currentMinutes = today.getHours() + 1 < 10 ? '0' + today.getMinutes() : today.getMinutes();
  let currentSeconds = today.getHours() + 1 < 10 ? '0' + today.getSeconds() : today.getSeconds();

  let date = currentDay + '/' + currentMonth + '/' + today.getFullYear();
  let time = currentHours + ":" + currentMinutes + ":" + currentSeconds;
  let dateTime = date + ', ' + time;
  return dateTime;
}
