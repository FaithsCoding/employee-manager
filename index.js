//dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");
const query = require("./db/query.sql");

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "employee_manager",
  password: "Faith123",
  database: "employee_manager",
});

module.exports = connection;

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }
  console.log("Connected to database.");
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
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Search Employees",
        "Search Departments",
        "Search Role",
        "Update Employee Role",
      ],
    })
    .then((answer) => {
      switch (answer.selection) {
        case "View All Employees":
          viewAllEmployees(connection);
          break;
        case "View All Departments":
          viewDepartments(connection);
          break;
        case "View All Roles":
          viewRole(connection);
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Search Employees":
          searchEmployee();
          break;
        case "Search Departments":
          searchDepartment();
          break;
        case "Search Role":
          searchRole();
          break;
        case "Update Employee Role":
          updateRole(connection);
          break;
        default:
          console.log("Invalid selection.");
          break;
      }
    });
}

function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id",
    function (err, result) {
      if (err) throw err;
      console.table(result);
      runSearch();
    }
  );
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    console.table(result);
    runSearch();
  });
}

function viewRole() {
  connection.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, result) {
      if (err) throw err;
      console.table(result);
      runSearch();
    }
  );
}

function addEmployee() {
  searchRole(function (roleChoices) {
    searchEmployee(function (employeeChoices) {
      searchDepartment(function (departmentChoices) {
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
              choices: employeeChoices,
            },
          ])
          .then(function (answer) {
            var getRoleId = String(answer.role).split("-");
            var getReportingToId = String(answer.reportingTo).split("-");
            var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                 VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
            connection.query(query, function (err, res) {
              console.log(
                `new employee ${answer.firstname} ${answer.lastname} added!`
              );
            });
            runSearch();
          });
      });
    });
  }, departmentChoices);
}

function addDepartment() {
  searchRole(function (roleChoices) {
    searchEmployee(function (employeeChoices) {
      searchDepartment(function (departmentChoices) {
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
      });
    });
  });
}

function addRole() {
  searchRole(function (roleChoices) {
    searchEmployee(function (employeeChoices) {
      searchDepartment(function (departmentChoices) {
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
              choices: departmentChoices,
            },
            {
              name: "salary",
              type: "number",
              message: "Enter the role's salary:",
            },
          ])
          .then(function (answer) {
            console.log(`${answer.role}`);
            var getDeptId = String(answer.dept).split("-");
            var query = `INSERT INTO role (title, salary, department_id)
                  VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
            connection.query(query, function (err, res) {
              console.log(`<br>-----new role ${answer.role} added!------`);
            });
            runSearch();
          });
      });
    });
  });
}

//empty array variables
let roleChoices = [];
let employeeChoices = [];
let departmentChoices = [];

function searchRole(callback) {
  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    roleChoices = data.map((role) => {
      return {
        name: `${role.title} (ID: ${role.id})`,
        value: role.id,
      };
    });
    callback(roleChoices);
  });
}

function searchEmployee(callback) {
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    employeeChoices = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name} (ID: ${employee.id})`,
        value: employee.id,
      };
    });
    callback(employeeChoices);
  });
}

function searchDepartment(callback) {
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    departmentChoices = data.map((department) => {
      return {
        name: `${department.name} (ID: ${department.id})`,
        value: department.id,
      };
    });
    callback(departmentChoices);
  });
}

function updateRole() {
  searchEmployee(function (employeeChoices) {
    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Select the employee to update:",
          choices: employeeChoices,
        },
      ])
      .then(function (employeeAnswer) {
        const employeeId = employeeAnswer.employeeId;

        searchRole(function (roleChoices) {
          inquirer
            .prompt([
              {
                name: "roleId",
                type: "list",
                message: "Select the new role:",
                choices: roleChoices,
              },
            ])
            .then(function (roleAnswer) {
              const roleId = roleAnswer.roleId;
              const query = "UPDATE employee SET role_id = ? WHERE id = ?";
              const values = [roleId, employeeId];

              connection.query(query, values, function (err, result) {
                if (err) throw err;
                console.log(`Employee role updated successfully!`);
                runSearch();
              });
            });
        });
      });
  });
}

module.exports = {
  viewAllEmployees,
  viewDepartments,
  viewRole,
  updateRole,
};
