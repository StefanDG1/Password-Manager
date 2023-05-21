const { BrowserWindow, app, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { send } = require("process");
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
      //   console.log("Rows fetched successfully: ", rows);
      event.sender.send("your data", rows);
      entry = rows.map((row) => {
        return {
          id: row.id,
          title: row.title,
          username: row.username,
          password: row.password,
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
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: ["jpg", "png", "gif", "svg"] }],
  });
  if (canceled) {
    return;
  } else {
    console.log(filePaths[0]);
    return filePaths[0];
  }
}

// code for sqlite3 db
ipcMain.handle("db:savedata", handleSaveData)
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
    });

    const string = JSON.stringify(newData);

    const encrypt = (string) => {
      const secret = "pppppppppppppppppppppppppppppppp";
      const iv = Buffer.from(crypto.randomBytes(16));
      const cipher = crypto.createCipheriv(
        "aes-256-ctr",
        Buffer.from(secret),
        iv
      );

      const encrypted = Buffer.concat([
        cipher.update(string), 
        cipher.final()
      ]);

      return {
        iv: iv.toString("hex"),
        username: encrypted.toString("hex"),
        password: encrypted.toString("hex"),
        title: encrypted.toString("hex"),
      };
    };

    const encryptedData = encrypt(string);

    var insertQuery = 'INSERT INTO user (username,password,title) VALUES ("'+encryptedData.username+'", "'+encryptedData.password+'", "'+encryptedData.title+'")';
    db.run(insertQuery, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Insertion Done");
    });
  }
