const {
  BrowserWindow,
  app,
  ipcMain,
  dialog,
  ipcRenderer,
} = require("electron");
const {
  uuid
} = require("uuidv4")
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const {
  send
} = require("process");
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.log("Error Occurred - " + err.message);
  } else {
    console.log("DataBase ready to retrieve files");
  }
});
ipcMain.on("get images", (event, data) => {
  fs.readdir("./images", (err, files) => {
    let imagesAvailable = [];
    files.forEach((file) => {
      imagesAvailable.push(file.split(".")[0]);
    });
    event.sender.send("your images", imagesAvailable);
  });
});
ipcMain.on("send me data", (event, data) => {
  db.all("SELECT * FROM user", [], (err, rows) => {
    if (err) {
      console.log("Error occurred while fetching data: ", err.message);
    } else {
      const secret = "pppppppppppppppppppppppppppppppp";
      //   console.log("Rows fetched successfully: ", rows);
      for (let index = 0; index < rows.length; index++) {
        let decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        let decipheredUsername = Buffer.concat([
          decipher.update(Buffer.from(rows[index].username, "hex")),
          decipher.final()
        ]);
        let username = decipheredUsername.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredPass = Buffer.concat([
          decipher.update(Buffer.from(rows[index].password, "hex")),
          decipher.final()
        ]);
        let password = decipheredPass.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredTitle = Buffer.concat([
          decipher.update(Buffer.from(rows[index].title, "hex")),
          decipher.final()
        ]);
        let title = decipheredTitle.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredWebsite = Buffer.concat([
          decipher.update(Buffer.from(rows[index].website, "hex")),
          decipher.final()
        ]);
        let website = decipheredWebsite.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredGroup = Buffer.concat([
          decipher.update(Buffer.from(rows[index].group, "hex")),
          decipher.final()
        ]);
        let group = decipheredGroup.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredNotes = Buffer.concat([
          decipher.update(Buffer.from(rows[index].notes, "hex")),
          decipher.final()
        ]);
        let notes = decipheredNotes.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredDateModified = Buffer.concat([
          decipher.update(Buffer.from(rows[index].dateModified, "hex")),
          decipher.final()
        ]);
        let dateModified = decipheredDateModified.toString();
        decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(secret),
          Buffer.from(rows[index].iv, "hex")
        )
        decipheredDateCreated = Buffer.concat([
          decipher.update(Buffer.from(rows[index].website, "hex")),
          decipher.final()
        ]);
        let dateCreated = decipheredDateCreated.toString();
        console.log(username, password, title);
        rows[index] = {
          username,
          password,
          title,
          website,
          group,
          notes,
          dateCreated,
          dateModified
        }
      }


      event.sender.send("your data", rows);
      entry = rows.map((row) => {
        return {
          id: row.id,
          title: row.title,
          username: row.username,
          password: row.password,
          iv: row.iv
        };
      });
    }
    rows.forEach((row) => {
      entry[row.id] = row.name;
    });
  });
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  //win.removeMenu();
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// code for image file
ipcMain.handle("dialog:openFile", handleFileOpen);

async function handleFileOpen() {
  const {
    canceled,
    filePaths
  } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{
      name: "Images",
      extensions: ["jpg", "png", "gif", "svg"]
    }],
  });
  if (canceled) {
    return;
  } else {
    console.log(filePaths[0]);
    return filePaths[0];
  }
}

// code for sqlite3 db
ipcMain.handle("db:savedata", handleSaveData);
// Do you know what the above line does
//  I don't know much about SQL

async function handleSaveData(newData) {
  console.log("save in mainrenderer " + newData);
  const fs = require("fs");
  const sqlite3 = require("sqlite3").verbose();
  let db = new sqlite3.Database("./db.sqlite", (err) => {
    if (err) {
      console.log("Error Occurred - " + err.message);
    } else {
      console.log("DataBase Connected");
    }
  });

  // const string = JSON.stringify(newData);
  //  newData is a JSON file
  // No dude you need export each at once you can't just pop the whole json, I'll show you what I mean
  // Oh you fucked up here


  const encrypt = (string) => {
    // okay
    const secret = "pppppppppppppppppppppppppppppppp";
    const iv = Buffer.from(crypto.randomBytes(16));
    //  I believe you have to save this 
    let cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    //  I don't understand how this works
    const encryptedUsername = Buffer.concat([cipher.update(string.username), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedPassword = Buffer.concat([cipher.update(string.password), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedTitle = Buffer.concat([cipher.update(string.title), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedWebsite = Buffer.concat([cipher.update(string.website), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedGroup = Buffer.concat([cipher.update(string.group), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedNotes = Buffer.concat([cipher.update(string.notes), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedDateCreated = Buffer.concat([cipher.update(string.dateCreated), cipher.final()]);
    cipher = crypto.createCipheriv(
      "aes-256-ctr",
      Buffer.from(secret),
      iv
    );
    const encryptedDateModified = Buffer.concat([cipher.update(string.lastModified), cipher.final()]);
    console.log(string.password, encryptedPassword)
    return {
      iv: iv.toString("hex"),
      username: encryptedUsername.toString("hex"),
      password: encryptedPassword.toString("hex"),
      title: encryptedTitle.toString("hex"),
      website: encryptedWebsite.toString("hex"),
      group: encryptedGroup.toString("hex"),
      notes: encryptedNotes.toString("hex"),
      dateCreated: encryptedDateCreated.toString("hex"),
      dateModified: encryptedDateModified.toString("hex"),
    };
    //  I think your iv is exported to the database
  };

  const encryptedData = encrypt(newData);
  console.log("encryptedDateModified: ", encryptedData.dateModified)
  db.all("SELECT * FROM user", [], (err, rows) => {
    if (err) {
      console.log("Error occurred while fetching data: ", err.message);
    } else {
      var insertQuery =
        'INSERT INTO user (id,uuid,iv,username,password,title,website,`group`,notes,dateCreated,dateModified) VALUES ("' +
        (rows.length + 1) +
        '", "' +
        uuid() +
        '", "' +
        encryptedData.iv +
        '", "' +
        encryptedData.username +
        '", "' +
        encryptedData.password +
        '", "' +
        encryptedData.title +
        '", "' +
        encryptedData.website +
        '", "' +
        encryptedData.group +
        '", "' +
        encryptedData.notes +
        '", "' +
        encryptedData.dateCreated +
        '", "' +
        encryptedData.dateModified +
        '")';


      db.run(insertQuery, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Insertion Done");
      });
    }
  });

}
ipcMain.on("save data to database", (event, data) => {
  handleSaveData(data);
})