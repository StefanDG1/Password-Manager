const { BrowserWindow, app, ipcMain, dialog, Tray, Menu, clipboard, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');


let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        title: 'MiniPass',
        icon: path.join(__dirname, '/images/icon.png'),
        webPreferences: {
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    mainWindow.loadFile(path.join(__dirname, "index.html"));
    //win.removeMenu();


    // hide window on close
    mainWindow.on('close', (event) => {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            event.returnValue = false;
        }
    });
}


// hide window on minimize or close

let isQuiting;
let tray;

app.on('before-quit', () => {
    globalShortcut.unregisterAll();
    isQuiting = true;
});


app.whenReady().then(() => {
    createWindow();

    // system tray
    tray = new Tray('./images/icon.png');
    const contextMenu = Menu.buildFromTemplate([{
            label: 'Show App',
            click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Quit',
            click: function () {
                isQuiting = true;
                app.quit();
            }
        }
    ]);

    const ctrlc = globalShortcut.register('CommandOrControl+K', () => {
        console.log('ctrl c is pressed');
        mainWindow.webContents.send('ctrl-c', 1);
    });




    tray.setToolTip('MiniPass');
    tray.setContextMenu(contextMenu);
    tray.setIgnoreDoubleClickEvents(true);
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })
});




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

// code for image file
ipcMain.handle('dialog:openFile', handleFileOpen)

async function handleFileOpen() {
    const {
        canceled,
        filePaths
    } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'Images',
            extensions: ['jpg', 'png', 'gif', 'svg']
        }, ]
    });
    if (canceled) {
        return
    } else {
        console.log(filePaths[0])
        return filePaths[0]
    }
}