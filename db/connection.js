//dependencies
const mysql = require("mysql2");
require("dotenv").config();

//this creates the connection to the db and tells it what login details to look for
const connection = mysql.createConnection({
  host: "127.0.0.1",
  //this allows my db login details to be encoded thereofore not as easily accessible to everyone
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
