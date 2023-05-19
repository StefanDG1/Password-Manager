
let divItems = document.getElementsByClassName("card");

//const fs = require("fs");
const path = api.path;
//fconst sqlite3 = require('sqlite3').verbose();
const fs = api.fs;
const sqlite3 = api.sqlite3;
const crypto = require("crypto");
const { ipcRenderer } = require("electron");

//

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


// function to change bg-color of selected card element and change info of info container

function selected(item) {
  infoContainer.style.display = "block";
  this.clear();
  //console.log(item);
  item.classList.add('current-selection');
  let currentlySelected = {};
  for (let i = 0; i < divItems.length; i++) {
    if (item.identifier == entries[i].id) {
      currentlySelected = entries[i];
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
  let currentDay = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  let currentMonth = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
  let currentHours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
  let currentMinutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
  let currentSeconds = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();

  let date = currentDay + '/' + currentMonth + '/' + today.getFullYear();
  let time = currentHours + ":" + currentMinutes + ":" + currentSeconds;
  let dateTime = date + ', ' + time;
  return dateTime;
}

// function to add image from filesystem and copy it to images folder
let filePath;
let fileName;
async function addImage(spanClassName) {
  filePath = await api.openFile()
  //console.log(filePath)
  fileName = path.basename(filePath)
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
  let title = document.getElementById('newTitle').value;
  let username = document.getElementById('newUsername').value;
  let password = document.getElementById('newPassword').value;
  let website = document.getElementById('newWebsite').value;
  let notes = document.getElementById('newNotes').value;
  let group = document.getElementById('newGroup').value;
  //let newIndex = entries.length;
  const newData = {
    //"id": newIndex,
    "title": title,
    "username": username,
    "password": password,
    "website": website,
    "notes": notes,
    //"icon": filePath,
    "group": group,
    "dateCreated": currentTime(),
    "lastModified": currentTime(),
  };
  

  console.log(newData);
  addData(newData);
  userCardContainer.replaceChildren();
  retrieveData();
  clearInput();
  closeNew();
}



function handleSaveData(newData) {
  console.log("saving data", newData);
  ipcRenderer.invoke("db:savedata", newData);
}



// code for encryption/decryption
/*
const data = saveChanges(newData.username);
const secret = (pppppppppppppppppppppppppppppppp)

const encrypt = (data) =>{
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCypheriv("aes-256-ctr", Buffer.from(secret), iv);

    const encrypted = buffer.concat([
        cipher.update(data),
        cipher.final(),
    ]);

    return {
      data: encrypted.toString("hex"),
  };
}

//ipcRenderer.send('encrypt', data);

const decrypt = (encrypt) =>{
    const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        Buffer.from(encrypt.iv, "hex")
    );

    return decryptedPassword.toString()
}

    module.exports = {encrypt, decrypt};
*/


function clearInput() {
  document.getElementById('newTitle').value = '';
  document.getElementById('newUsername').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('newWebsite').value = '';
  document.getElementById('newNotes').value = '';
  document.getElementById('newGroup').value = '';
  filePath = null;
  document.getElementsByClassName('image-text')[0].innerHTML = '';

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

console.log(api.fs)

async function addData(newData){
  console.log(newData);
    await api.saveData(newData);
}
