const { BrowserWindow, app, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require("fs");
const crypto = require("crypto");


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
/*
const data = saveChanges(newData.username);
const secret = (pppppppppppppppppppppppppppppppp)
*/



/*
ipcMain.on('encrypt', (event,data) => { 
    const secret = 'pppppppppppppppppppppppppppppppp';
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
})
*/

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

    const string = JSON.stringify(newData);

    const encrypt = (string) =>{
        const secret = ('pppppppppppppppppppppppppppppppp');
        const iv = Buffer.from(crypto.randomBytes(16));
        const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);
    
        const encrypted = Buffer.concat([
            cipher.update(string),
            cipher.final(),
        ]);
    
        return {
            iv: iv.toString("hex"),
            username: encrypted.toString("hex"),
            password: encrypted.toString("hex"),
            title: encrypted.toString("hex"),
      };
    }

    const encryptedData = encrypt(string);

    var insertQuery = 'INSERT INTO user (username,password,title) VALUES ("'+encryptedData.username+'", "'+encryptedData.password+'", "'+encryptedData.title+'")';
    db.run(insertQuery, (err) => {
      if(err) {
            console.log(err);
            return;
        }
      console.log("Insertion Done");
    });
}