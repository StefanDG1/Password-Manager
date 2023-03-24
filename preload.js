const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const dialog = require("electron");
const path = require("path");

console.log("Preload loaded");
const API = {
    fs: fs,
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    newItemWin: () => ipcRenderer.invoke('newItemWindow'),
    path: path,
}

contextBridge.exposeInMainWorld("api", API);