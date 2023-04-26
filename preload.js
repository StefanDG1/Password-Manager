const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('sqlite3').verbose();

const fs = require('fs');
const dialog = require("electron");
const path = require("path");


console.log("Preload loaded");
const API = {
    fs: fs,
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveData: (newData) => ipcRenderer.invoke('db:savedata',newData),
    path: path,
    //sqlite3: sqlite3,
}

contextBridge.exposeInMainWorld("api", API);
