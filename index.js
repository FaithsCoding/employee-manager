//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
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
        "View Role",
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
        viewDepartments();
      } else if (answer.selection === "View role") {
        viewRole();
      } else if (answer.selection === "Add Employee") {
        addEmployee();
      } else if (answer.selection === "Add Department") {
        addDepartment();
      } else if (answer.selection === "Add Role") {
        addRole();
      } else if (answer.selection === "Update Role") {
        updateRole();
      } else {
        connection.end();
      }
    });
}

//function to view all employees
function viewAllEmployees() {
  //sends sql statements to sql server for execution
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.deparment_id = deparment.id",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      //another prompt to the user for another selection
      runSearch();
    }
  );
}

// function to view all roles
function viewRole() {
  connection.query(
    "SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
    function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      // another prompt for the user to choose another selection
      runSearch();
    }
  );
}

//function to view all departments
function  viewDepartments(){
    connection.query("SELECT * FROM department", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        // re-prompt the user for another selection
        runSearch();
      }
    ); 
};
