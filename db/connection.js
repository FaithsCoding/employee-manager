//dependencies
const mysql = require("mysql2");
//this creates the connection to the db and tells it what login details to look for
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "employee_manager",
  password: "Faith123",
  database: "employee_manager",
});

//this shows the user any errors when trying to connect or gives them a confirmation if it has been successful
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

//this allows us to export that function gloabbly and call in into our index.js file by requiring this file.
module.exports = connection;
