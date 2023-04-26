const { BrowserWindow, app, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require("fs");

/*
var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./db.sqlite"
    }
});
*/

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    //win.removeMenu();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

// code for image file
ipcMain.handle('dialog:openFile', handleFileOpen)

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ 
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif', 'svg'] },
          ]
    });
    if (canceled) {
        return
    } else {
        console.log(filePaths[0])
        return filePaths[0]
    }
}

// code for sqlite3 db
ipcMain.handle('db:savedata', handleSaveData)
async function handleSaveData(event, newData) {
    console.log("save in mainrenderer " + newData);
    const fs = require("fs");
    const sqlite3 = require("sqlite3").verbose();
    let db = new sqlite3.Database("./db.sqlite", (err) => {
      if(err) {
          console.log("Error Occurred - " + err.message);
      }
      else {
          console.log("DataBase Connected");
      }
    });

    var insertQuery = 'INSERT INTO user (username,password,title) VALUES ("'+newData.username+'","'+newData.password+'","'+newData.title+'")';
    db.run(insertQuery, (err) => {
      if(err) {
            console.log(err);
            return;
        }
      console.log("Insertion Done");
    });
}