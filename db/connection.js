const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "employee_manager",
  password: "Faith123",
  database: "employee_manager",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

module.exports = connection;
