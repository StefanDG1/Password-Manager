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
      for (let index = 0; index < rows.length; index++) {
        let decrypt = (string) => {
          let decipher = crypto.createDecipheriv(
            "aes-256-ctr",
            Buffer.from(secret),
            Buffer.from(rows[index].iv, "hex")
          )
          return Buffer.concat([
            decipher.update(Buffer.from(string, "hex")),
            decipher.final()
          ]);
        }
        let username = decrypt(rows[index].username).toString();
        let password = decrypt(rows[index].password).toString();
        let title = decrypt(rows[index].title).toString();
        let website = decrypt(rows[index].website).toString();
        let group = decrypt(rows[index].group).toString();
        let notes = decrypt(rows[index].notes).toString();
        let dateModified = decrypt(rows[index].dateModified).toString();
        let dateCreated = decrypt(rows[index].dateCreated).toString();
        let uuid = rows[index].uuid;
        rows[index] = {
          uuid,
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

async function handleSaveData(event, newData) {
  console.log("save in mainrenderer " + newData);
  const fs = require("fs");
  const sqlite3 = require("sqlite3").verbose();
  let db = new sqlite3.Database("./db.sqlite", (err) => {
    if (err) {
      console.log("Error Occurred - " + err.message);
    } else {
      console.log("DataBase Connected");
    }
  });const encrypt = (string) => {
    let encrypt = (string) => {
      let cipher = crypto.createCipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        iv
      );
      return Buffer.concat([cipher.update(string), cipher.final()]);
    }
    const secret = "pppppppppppppppppppppppppppppppp";
    const iv = Buffer.from(crypto.randomBytes(16));
    return {
      iv: iv.toString("hex"),
      username: encrypt(string.username).toString("hex"),
      password: encrypt(string.password).toString("hex"),
      title: encrypt(string.title).toString("hex"),
      website: encrypt(string.website).toString("hex"),
      group: encrypt(string.group).toString("hex"),
      notes: encrypt(string.notes).toString("hex"),
      dateCreated: encrypt(string.dateCreated).toString("hex"),
      dateModified: encrypt(string.lastModified).toString("hex"),
    };
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
        event.sender.send("Ready for updation")
      });
    }
  });

}
ipcMain.on("save data to database", (event, data) => {
  handleSaveData(event, data);
})