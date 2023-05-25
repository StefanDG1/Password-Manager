const sqlite3 = api.sqlite3;
let entriesData = {};
let divItems = document.getElementsByClassName("card");
let filePath;
let fileName;
const infoContainer = document.getElementsByClassName("info-container")[0];
const infoIcon = document.getElementsByClassName("info-icon-pic")[0];
const infoTitle = document.getElementsByClassName("info-title")[0];
const infoWebsite = document.getElementsByClassName("info-website")[0];
const infoUsername = document.getElementsByClassName("info-username")[0];
const infoPassword = document.getElementsByClassName("info-password")[0];
const infoGroup = document.getElementsByClassName("info-group")[0];
const infoNotes = document.getElementsByClassName("info-notes")[0];
const infoCreated = document.getElementsByClassName("info-created")[0];
const infoModified = document.getElementsByClassName("info-modified")[0];
const popUpNew = document.getElementsByClassName("pop-up-new")[0];
const userCardTemplate = document.querySelector("[card-template]");
const userCardContainer = document.querySelector("[user-cards-container]");
const searchInput = document.querySelector("[search-box]");

function changeTheme() {
  if (document.querySelector("head > link").href.includes("light")) {
    document.querySelector("head > link").href = "./dark.css"
  } else {
    document.querySelector("head > link").href = "./light.css"
  }
}

function request() {
  window.api.requestImages();
  window.api.requestData();
}
let imagesAvailable;

window.api.handleImages((event, images) => {
  imagesAvailable = images;
});

function selected(item) {
  infoContainer.style.display = "block";
  this.clear();
  item.classList.add("current-selection");
  let currentlySelected = entriesData[item.children[1].children[2].innerText];
  infoIcon.src = `./images/${currentlySelected.title}.png`;
  infoTitle.textContent = currentlySelected.title;
  infoWebsite.textContent = currentlySelected.website;
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
    item.classList.remove("current-selection");
  }
}

function closeInfo() {
  infoContainer.style.display = "none";
  document.querySelector(".current-selection").classList.remove("current-selection");
}

searchInput.addEventListener("input", (e) => {
  document.querySelectorAll(".hide").forEach(el => el.classList.remove("hide"))
  const value = e.target.value.toLowerCase();
  for (let i in entriesData) {
    let entry = entriesData[i];
    let isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value);
    if (!isVisible) {
      document.querySelectorAll("div.card-uuid").forEach(el => {
        if (el.innerHTML == entry.uuid) {
          el.parentElement.parentElement.classList.toggle("hide", !isVisible)
        }
      })
    }
  }
});

searchInput.addEventListener("click", (e) => {
  const value = e.target.value.toLowerCase();
  if (value == "") {
    document.querySelectorAll(".hide").forEach(el => el.classList.remove("hide"))
  } else {
    for (let i in entriesData) {
      let entry = entriesData[i];
      let isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value);
      console.log(isVisible);
      if (!isVisible) {
        document.querySelectorAll("div.card-uuid").forEach(el => {
          if (el.innerHTML == entry.uuid) {
            el.parentElement.parentElement.classList.toggle("hide", !isVisible)
          }
        })
      }
    }
  }
});

searchInput.addEventListener("focus", (e) => {
  const value = e.target.value.toLowerCase();
  if (value == "") {
    document.querySelectorAll(".hide").forEach(el => el.classList.remove("hide"))
  } else {
    for (let i in entriesData) {
      let entry = entriesData[i];
      let isVisible = entry.title.toLowerCase().includes(value) || entry.username.toLowerCase().includes(value);
      if (!isVisible) {
        document.querySelectorAll("div.card-uuid").forEach(el => {
          if (el.innerHTML == entry.uuid) {
            el.parentElement.parentElement.classList.toggle("hide", !isVisible)
          }
        })
      }
    }
  }
});

function addNew(obj) {
  let usersjson = fs.readFileSync("database.json", "utf-8");
  let users = JSON.parse(usersjson);
  users.push(obj);
  usersjson = JSON.stringify(users);
  fs.writeFileSync("database.json", usersjson, "utf-8");
}

function currentTime() {
  let today = new Date();
  let currentDay =
    today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  let currentMonth =
    today.getMonth() + 1 < 10 ?
    "0" + (today.getMonth() + 1) :
    today.getMonth() + 1;
  let currentHours =
    today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  let currentMinutes =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
  let currentSeconds =
    today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
  let date = currentDay + "/" + currentMonth + "/" + today.getFullYear();
  let time = currentHours + ":" + currentMinutes + ":" + currentSeconds;
  let dateTime = date + ", " + time;
  return dateTime;
}

async function addImage(spanClassName) {
  filePath = await openFile();
  fileName = path.basename(filePath);
  document.getElementsByClassName(spanClassName)[0].innerHTML = fileName;
}
window.api.handleData((event, rows) => {
  document.querySelectorAll(".card").forEach(card => card.remove());
  let entries = [];
  for (let i = 0; i < rows.length; i++) {
    entriesData[rows[i].uuid] = rows[i];
  }
  rows.forEach((row) => {

    entries[row.id] = {
      username: row.username,
      password: row.password,
      title: row.title,
      uuid: row.uuid
    };
  });

  rows.reverse().map((entry) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    card.querySelector("[card-username]").innerText = entry.username;
    card.querySelector(".card-uuid").innerText = entry.uuid;
    card.querySelector("[card-title]").innerText = entry.title;
    if (imagesAvailable.includes(entry.title.toLowerCase())) {
      card.querySelector(
        "[card-icon]"
      ).src = `./images\\${entry.title.toLowerCase()}.png`;
    }
    card.identifier = entries.id;
    userCardContainer.append(card);
    return {
      id: entries.id,
      title: entries.title,
      username: entries.username,
      password: entries.password,
      element: card,
    };
  });
});

function saveChanges() {
  let title = document.getElementById("newTitle").value;
  let username = document.getElementById("newUsername").value;
  let password = document.getElementById("newPassword").value;
  let website = document.getElementById("newWebsite").value;
  let notes = document.getElementById("newNotes").value;
  let group = document.getElementById("newGroup").value;
  const newData = {
    title: title,
    username: username,
    password: password,
    website: website,
    notes: notes,
    group: group,
    dateCreated: currentTime(),
    lastModified: currentTime(),
  };
  addData(newData);
  clearInput();
  closeNew();
}

window.api.update(() => {
  request();
})


function clearInput() {
  document.getElementById("newTitle").value = "";
  document.getElementById("newUsername").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("newWebsite").value = "";
  document.getElementById("newNotes").value = "";
  document.getElementById("newGroup").value = "";
  filePath = null;
  document.getElementsByClassName("image-text")[0].innerHTML = "";
}

function closeNew() {
  const popUpNew = document.getElementsByClassName("pop-up-new")[0];
  popUpNew.style.display = "none";
}

function openNew() {
  const popUpNew = document.getElementsByClassName("pop-up-new")[0];
  popUpNew.style.display = "block";
}

async function addData(newData) {
  console.log(newData);
  window.api.saveData(newData);
}