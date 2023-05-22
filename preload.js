const { contextBridge, ipcRenderer, clipboard, globalShortcut } = require('electron');
const fs = require('fs');
const path = require("path");

const key = '6400db5434109a366fb0104d6144a693d184d19dec3d4371527ae3a34fb6d125';
var encryptor = require('simple-encryptor')(key);

console.log("Preload loaded");
const API = {
    fs: fs,
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    path: path,
    clipboard: clipboard,
    ctrlc: (callback) => ipcRenderer.on('ctrl-c', callback),
    encryptor: encryptor,
}

contextBridge.exposeInMainWorld("api", API);