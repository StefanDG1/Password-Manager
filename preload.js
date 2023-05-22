const { contextBridge, ipcRenderer } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const crypto = require('crypto');
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
  saveData: (newData) => ipcRenderer.send("save data to database", newData),
  // ! Am excited, I believe this would work.
  // ? problem was in this line
  // * bug #392 solved
  // ! yes
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
  crypto
};

contextBridge.exposeInMainWorld("api", API);
