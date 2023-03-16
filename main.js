const { BrowserWindow, app } = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    win.loadFile(path.join(__dirname, "index.html"));
    //win.removeMenu();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});