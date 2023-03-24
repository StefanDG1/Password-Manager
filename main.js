const { BrowserWindow, app, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require("fs");
const { create } = require('domain');


let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
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
        return filePaths[0]
    }
}


const createNewItemWindow = async () => {
    const newItemWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        webPreferences: {
            preloadcontextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    await newItemWindow.loadFile(path.join(__dirname, "./newItem/newItem.html"));
    newItemWindow.once('ready-to-show', () => {
        newItemWindow.show()
      })
    //win.removeMenu();
}

ipcMain.handle('newItemWindow', createNewItemWindow)
