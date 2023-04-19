//dependencies
const mysql = require("mysql");
const inquirier = require("inquirier");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  //port number
  port: 3306,
  //username
  user: "root",
  //password
  password: "new_password",
  database: "employee-manager",
});

//catch any connection errros
connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

//code to add prompts for main menu
function runSearch() {
  inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Department",
        "View role",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Role",
      ],
    })
    .then(function (answer) {
      console.log(answer);

      if (answer.selection === "View All Employees") {
        viewAll();
      } else if (answer.selection === "View Department") {
        viewDepts();
      } else if (answer.selection === "View role") {
        viewrole();
      } else if (answer.selection === "Add Employee") {
        addEmployee();
      } else if (answer.selection === "Add Department") {
        addDept();
      } else if (answer.selection === "Add Role") {
        addRole();
      } else if (answer.selection === "Update Role") {
        updateRole();
      } else {
        connection.end();
      }
    });
}
