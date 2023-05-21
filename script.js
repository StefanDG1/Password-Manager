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
  //console.log(item);
  item.classList.add("current-selection");
  let currentlySelected = {};
  console.log(entriesData);

  for (let i = 0; i < divItems.length; i++) {
    if (entriesData[i]) {
      if (item.identifier == entriesData[i].id) {
        currentlySelected = entriesData[i];
      }
    }
  }
  //console.log(currentlySelected);
  infoIcon.src = currentlySelected.icon;
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

// code to create div card elements from database file and filter results based on search bar

const userCardTemplate = document.querySelector("[card-template]");
const userCardContainer = document.querySelector("[user-cards-container]");
const searchInput = document.querySelector("[search-box]");
// document.body.style.backgroundColor = 'red';

// entries are all the database entries

// filter through search results on click, focus (with tab), or when writing

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

// fetch data from database and map each entry so that you make a new card with title
// and email info from template

// prototype function to add new user data and update the list of elements

function addNew(obj) {
  let usersjson = fs.readFileSync("database.json", "utf-8");
  let users = JSON.parse(usersjson);
  //let newIndex = users[users.length - 1].id + 1;
  // let obj = {
  //   "id": newIndex,
  //   "title": obj.title,
  //   "username": obj.username,
  //   "password": obj.password,
  //   "website": obj.website,
  //   "notes": "new entries",
  //   "icon": "./images/youtube.png",
  //   "group": "new entry group",
  //   "dateCreated": timeNow,
  //   "lastModified": timeNow,
  // }
  users.push(obj);
  usersjson = JSON.stringify(users);
  fs.writeFileSync("database.json", usersjson, "utf-8");

  // empty card template and get data from database again to update list
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

// function to add image from filesystem and copy it to images folder
let filePath;
let fileName;
async function addImage(spanClassName) {
  filePath = await openFile();
  //console.log(filePath)
  fileName = path.basename(filePath);
  //console.log(fileName)
  document.getElementsByClassName(spanClassName)[0].innerHTML = fileName;

  /* run this code on save button
    // Copy the chosen file to the application's data path
    fs.copyFile(filePath, "./images/" + fileName, (err) => {
        if (err) throw err;
        console.log('Image: ' + fileName + ' was stored.');
    });
  
    */
}

function saveChanges() {
  let title = document.getElementById("newTitle").value;
  let username = document.getElementById("newUsername").value;
  let password = document.getElementById("newPassword").value;
  let website = document.getElementById("newWebsite").value;
  let notes = document.getElementById("newNotes").value;
  let group = document.getElementById("newGroup").value;
  //let newIndex = entries.length;
  const newData = {
    //"id": newIndex,
    title: title,
    username: username,
    password: password,
    website: website,
    notes: notes,
    //"icon": filePath,
    group: group,
    dateCreated: currentTime(),
    lastModified: currentTime(),
  };

  window.api.handleData((event, rows) => {
    console.log("You got data from the server side: ", rows);

    let entries = [];
    rows.forEach((row) => {
      entries[row.id] = {
        username: row.username,
        password: row.password,
        title: row.title,
      };
    });
    console.log(entries);
    entriesData = entries;
    rows.map((entry) => {
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
  //userCardContainer.replaceChildren();
  retrieveData();
  clearInput();
  closeNew();
}
saveChanges();

function handleSaveData(newData) {
  console.log("saving data", newData);
  ipcRenderer.invoke("db:savedata", newData);
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