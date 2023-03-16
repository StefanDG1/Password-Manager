const { contextBridge } = require('electron');
const fs = require('fs');


const API = {
    fs: fs,
}

contextBridge.exposeInMainWorld("api", API);