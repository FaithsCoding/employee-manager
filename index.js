//dependencies
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");
const query = require("./db/query.sql");
const art = require("./helpers/employee-manager-art");
const clear = require("console-clear");

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

art();

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
        "Update Employee Manager",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "Exit",
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
        case "Delete Department":
          deleteDepartment();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Update Employee Manager":
          updateManager(connection);
          break;
        case "Update Managaer":
          updateManager(connection);
          break;
        case "Exit":
          console.log("Thanks for using Employee Manager!");
          process.exit();
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
      console.table("All Employees", result);
      runSearch();
    }
  );
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    console.table("Departments", result);
    runSearch();
  });
}

function viewRole() {
  connection.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, result) {
      if (err) throw err;
      console.table("Roles", result);
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
  });
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

function deleteDepartment() {
  searchDepartment(function (departmentChoices) {
    inquirer
      .prompt([
        {
          name: "dept",
          type: "list",
          message: "Which department would you like to delete?",
          choices: departmentChoices,
        },
      ])
      .then(function (answer) {
        var getDeptId = String(answer.dept).split("-");
        var query = `DELETE FROM department WHERE id = '${getDeptId[0]}'`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(`Department deleted successfully!`);
        });
        runSearch();
      });
  });
}

function deleteRole() {
  searchRole(function (roleChoices) {
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "Which role would you like to delete?",
          choices: roleChoices,
        },
      ])
      .then(function (answer) {
        var getRoleId = String(answer.role).split("-");
        var query = `DELETE FROM role WHERE id = '${getRoleId[0]}'`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(`Role deleted successfully!`);
        });
        runSearch();
      });
  });
}

function deleteEmployee() {
  searchEmployee(function (employeeChoices) {
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to delete?",
          choices: employeeChoices,
        },
      ])
      .then(function (answer) {
        var getEmployeeId = String(answer.employee).split("-");
        var query = `DELETE FROM employee WHERE id = '${getEmployeeId[0]}'`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(`Employee deleted successfully!`);
        });
        runSearch();
      });
  });
}

function searchRole(callback) {
  connection.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    const roleChoices = result.map((role) => ({
      name: `${role.id} - ${role.title}`,
      value: role.id,
    }));
    callback(roleChoices);
  });
}

function searchEmployee(callback) {
  connection.query("SELECT * FROM employee", function (err, result) {
    if (err) throw err;
    const employeeChoices = result.map((employee) => ({
      name: `${employee.id} - ${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    callback(employeeChoices);
  });
}

function searchDepartment(callback) {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    const departmentChoices = result.map((department) => ({
      name: `${department.id} - ${department.name}`,
      value: department.id,
    }));
    callback(departmentChoices);
  });
}

function searchManager(callback) {
  connection.query(
    "SELECT * FROM employee WHERE manager_id IS NOT NULL",
    function (err, result) {
      if (err) throw err;
      const managerChoices = result.map((manager) => ({
        name: `${manager.id} - ${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      }));
      callback(managerChoices);
    }
  );
}

function updateManager() {
  searchEmployee(function (employeeChoices) {
    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Select the employee to update the manager:",
          choices: employeeChoices,
        },
      ])
      .then(function (employeeAnswer) {
        const employeeId = employeeAnswer.employeeId;

        searchManager(function (managerChoices) {
          inquirer
            .prompt([
              {
                name: "managerId",
                type: "list",
                message: "Select the new manager:",
                choices: managerChoices,
              },
            ])
            .then(function (managerAnswer) {
              const managerId = managerAnswer.managerId;
              const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
              const values = [managerId, employeeId];

              connection.query(query, values, function (err, result) {
                if (err) throw err;
                console.log(`Employee manager updated successfully!`);
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
  updateManager,
};
