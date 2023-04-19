//dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "faithscoding",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }

  console.log("Connected to database.");

  // read the contents of the schema.sql file
  const sql = fs.readFileSync("./db/schema.sql", "utf-8");

  // execute the SQL statements
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL statements:", err.stack);
      return;
    }

    console.log("Schema.sql file executed successfully!");
    console.log(results);
  });
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
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    // re-prompt the user for another selection
    runSearch();
  });
}

//empty array variables
const roleChoices = [];
const employeeChoice = [];
const departmentChoices = [];

//function to look up each role
function lookupRole() {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleChoices.push(data[i].id + "-" + data[i].title);
    }
  });
}

//function to look up employees
function lookupEmployee() {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      employeeChoice.push(
        data[i].id + "-" + data[i].first_name + " " + data[i].last_name
      );
    }
  });
}

//function to lookup department
function lookupDepartments() {
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      departmentChoice.push(data[i].id + "-" + data[i].name);
    }
  });
}

//function to ask the user for new employee info
function addEmployee() {
  lookupRole();
  lookupEmployee();

  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?",
      },

      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?",
      },

      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices,
      },

      {
        name: "reportingTo",
        type: "list",
        message: "Who is the employee's manager?",
        choices: empChoices,
      },
    ])
    //then function to use the answer to create a SQL query that inserts a new record
    .then(function (answer) {
      var getRoleId = answer.role.split("-");
      var getReportingToId = answer.reportingTo.split("-");
      var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
             VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
      connection.query(query, function (err, res) {
        console.log(
          `new employee ${answer.firstname} ${answer.lastname} added!`
        );
      });
      runSearch();
    });
}

//function to add roles
function addRole() {
  //runs these functions
  lookupRole();
  lookupEmployee();
  lookupDepartments();

  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "Enter the role you would like to add:",
      },

      {
        name: "dept",
        type: "list",
        message: "In what department would you like to add this role?",
        choices: deptChoices,
      },

      {
        name: "salary",
        type: "number",
        message: "Enter the role's salary:",
      },
    ])
    .then(function (answer) {
      console.log(`${answer.role}`);
      var getDeptId = answer.dept.split("-");
      var query = `INSERT INTO role (title, salary, department_id)
            VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
      connection.query(query, function (err, res) {
        console.log(`<br>-----new role ${answer.role} added!------`);
      });
      runSearch();
    });
}

//fuction to add departments
function addDepartment() {
  lookupRole();
  lookupEmployee();
  lookupDepartments();

  inquirer
    .prompt([
      {
        name: "dept",
        type: "input",
        message: "Enter the department you would like to add:",
      },
    ])
    .then(function (answer) {
      var query = `INSERT INTO department (name)
           VALUES ('${answer.dept}')`;
      connection.query(query, function (err, res) {
        console.log(`-------new department added: ${answer.dept}-------`);
      });
      runSearch();
    });
}

//function to update role and use SQL statements to the server for execution
function updateRole() {
  connection.query("SELECT * FROM employee", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employeeName",
          type: "list",

          message: "Which employee's role is changing?",
          choices: function () {
            var employeeArray = [];
            result.forEach((result) => {
              employeeArray.push(result.last_name);
            });
            return employeeArray;
          },
        },
      ])

      .then(function (answer) {
        console.log(answer);
        const name = answer.employeeName;

        connection.query("SELECT * FROM role", function (err, res) {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: function () {
                  var roleArray = [];
                  res.forEach((res) => {
                    roleArray.push(res.title);
                  });
                  return roleArray;
                },
              },
            ])
            .then(function (roleAnswer) {
              const role = roleAnswer.role;
              console.log(role);
              connection.query(
                "SELECT * FROM role WHERE title = ?",
                [role],
                function (err, res) {
                  if (err) throw err;
                  let roleId = res[0].id;

                  let query =
                    "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name];

                  connection.query(query, values, function (err, res, fields) {
                    console.log(`You have updated ${name}'s role to ${role}.`);
                  });
                  viewAll();
                }
              );
            });
        });
      });
  });
}
