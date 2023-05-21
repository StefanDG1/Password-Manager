const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("./db.sqlite", (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    }
    else {
        console.log("DataBase ready to retrieve files");
    }
});
console.log(db);
let entry;
db.all('SELECT * FROM user', [], (err, rows) => {
    if (err) {
        console.log('Error occurred while fetching data: ', err.message);
    } else {
        console.log('Rows fetched successfully: ', rows);
        entry = rows.map(row => {
            return {
                id: row.id,
                title: row.title,
                username: row.username,
                password: row.password,
            };
        });
    }
    rows.forEach((row) => {
        entry[row.id] = row.name;
    })
})