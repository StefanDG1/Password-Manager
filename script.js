const sqlite3 = api.sqlite3;
let entriesData = [];
let divItems = document.getElementsByClassName("card");

function request() {
  console.log("loaded!");
  window.api.requestImages();
  window.api.requestData();
}

const decrypt = (encryption) => {
  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryption.password, "hex")),
    decipher.final()
  ]);
  return decryptedPassword.toString()
}

let imagesAvailable;

window.api.handleImages((event, images) => {
  imagesAvailable = images;
});

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

function selected(item) {
  infoContainer.style.display = "block";
  this.clear();
  item.classList.add("current-selection");
  console.log("entried data", entriesData);
  let currentlySelected = entriesData[item.children[1].children[1].innerText];
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
}
const userCardTemplate = document.querySelector("[card-template]");
const userCardContainer = document.querySelector("[user-cards-container]");
const searchInput = document.querySelector("[search-box]");
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  entriesData.forEach((entry) => {
    const isVisible =
      entry.title.toLowerCase().includes(value) ||
      entry.username.toLowerCase().includes(value);
    entry.element.classList.toggle("hide", !isVisible);
  });
});

searchInput.addEventListener("click", (e) => {
  const value = e.target.value.toLowerCase();
  entriesData.forEach((entry) => {
    const isVisible =
      entry.title.toLowerCase().includes(value) ||
      entry.username.toLowerCase().includes(value);
    entry.element.classList.toggle("hide", !isVisible);
  });
});

searchInput.addEventListener("focus", (e) => {
  const value = e.target.value.toLowerCase();
  entriesData.forEach((entry) => {
    const isVisible =
      entry.title.toLowerCase().includes(value) ||
      entry.username.toLowerCase().includes(value);
    entry.element.classList.toggle("hide", !isVisible);
  });
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

let filePath;
let fileName;
async function addImage(spanClassName) {
  filePath = await openFile();
  fileName = path.basename(filePath);
  document.getElementsByClassName(spanClassName)[0].innerHTML = fileName;
  /* run this code on Fbutton
    
    fs.copyFile(filePath, "./images/" + fileName, (err) => {
        if (err) throw err;
        console.log('Image: ' + fileName + ' was stored.');
    });
  
    */
}
window.api.handleData((event, rows) => {
  console.log("You got data from the server side: ", rows);
  let entries = [];
  for (let i = 0; i < rows.length; i++) {
    console.log("rows:", rows[i])
    entriesData[rows[i].username] = rows[i];
  }
  console.log("entriesData: ", entriesData)
  rows.forEach((row) => {

    entries[row.id] = {
      username: row.username,
      password: row.password,
      title: row.title,
    };
  });
  console.log(entries);

  rows.reverse().map((entry) => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    card.querySelector("[card-username]").innerText = entry.username;
    card.querySelector("[card-title]").innerText = entry.title;
    if (imagesAvailable.includes(entry.title.toLowerCase())) {
      console.log("Found ", entry.title);
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

  function retrieveData() {
    async function handleSaveData(data) {
      let db = new sqlite3.Database("./db.sqlite", (err) => {
        if (err) {
          console.log("Error Occurred - " + err.message);
        } else {
          console.log("DataBase ready to retrieve files");
        }
      });
      await db.all("SELECT * FROM user", [], (err, rows) => {
        if (err) {
          console.log("Error occurred while fetching data: ", err.message);
        } else {
          console.log("Rows fetched successfully: ", rows);
          rowstosend = rows;
          entries = rows.map((row) => {
            return {
              id: row.id,
              title: row.title,
              username: row.username,
              password: row.password,
            };
          });
        }
        rows.forEach((row) => {
          entries[row.id] = {
            username: row.username,
            password: row.password,
            title: row.title,
          };
        });
      });
      console.log("save in mainrenderer " + data);
    }
  }
  console.log(newData);
  addData(newData);
}

function handleSaveData(newData) {
  console.log("saving data", newData);
}

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
const popUpNew = document.getElementsByClassName("pop-up-new")[0];

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