const { contextBridge, ipcRenderer } = require("electron");
const sqlite3 = require("sqlite3").verbose();

const fs = require("fs");
const dialog = require("electron");
const path = require("path");

let entry;
let rows;
console.log("Preload loaded");
const API = {
  sqlite3: sqlite3,
  fs: fs,
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
  saveData: (newData) => ipcRenderer.invoke("db:savedata", newData),
  retrieveData: (rows) => ipcRenderer.invoke("db:retrievedata", rows),
  path: path,
  entry: entry,
  rows,
  requestImages: () => ipcRenderer.send("get images", "Hi server"),
  handleData: (callback) => ipcRenderer.on("your data", callback),
  handleImages: (callback) => ipcRenderer.on("your images", callback),
  requestData: () => {
    ipcRenderer.send("send me data", "Hello World!");
  },
};

contextBridge.exposeInMainWorld("api", API);
