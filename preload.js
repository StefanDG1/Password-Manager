const { contextBridge, ipcRenderer, clipboard, globalShortcut } = require('electron');
const fs = require('fs');
const dialog = require("electron");
const path = require("path");

console.log("Preload loaded");
const API = {
    fs: fs,
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    path: path,
    clipboard: clipboard,
    ctrlc: (callback) => ipcRenderer.on('ctrl-c', callback),
}

contextBridge.exposeInMainWorld("api", API);