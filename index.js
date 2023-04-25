const inquirer = require("inquirer");
require("console.table");
const db = require("./db/connection");
const art = require("./helpers/employee-manager-art");

// Call the art function to display the l

// Define the runSearch function
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
        "Update Employee Role",
        "Update Employee Manager",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "Exit",
      ],
    })
    //this then function handles user input and executes the different functions depending on whats been selected
    .then((answer) => {
      switch (answer.selection) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRole();
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateManager();
          break;
        case "Exit":
          exitProgram();
          break;
        default:
          console.log("Invalid selection.");
          break;
      }
    });
}

//this function allows the user to view all employees and allows them to view by manager
function viewAllEmployees() {
  inquirer
    .prompt([
      {
        name: "viewOption",
        type: "list",
        message:
          "Would you like to view all employees or employees by manager?",
        choices: ["All employees", "Employees by manager"],
      },
    ])
    //then if the answer is all employees it queries the database and asks for the different categories
    .then((answer) => {
      if (answer.viewOption === "All employees") {
        db.query(
          "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employees manager ON employees.manager_id = manager.id",
          function (err, result) {
            if (err) throw err;
            //this then consoles logs the results and runs the runsearch function
            console.table(result);
            runSearch();
          }
        );
        //this allows the user to view the correct info if they choose to view by manager
      } else if (answer.viewOption === "Employees by manager") {
        searchManager(function (managerChoices) {
          inquirer
            .prompt([
              {
                name: "managerId",
                type: "list",
                message: "Which manager's employees would you like to view?",
                choices: managerChoices,
              },
            ])
            .then(function (managerAnswer) {
              const managerId = managerAnswer.managerId;
              const query =
                "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employees manager ON employees.manager_id = manager.id WHERE manager.id = ?";
              const values = [managerId];

              db.query(query, values, function (err, result) {
                if (err) throw err;
                console.table(result);
                runSearch();
              });
            });
        });
      }
    });
}

//this function allows the user to view all departments by querying the db
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    console.table("Departments", result);
    runSearch();
  });
}

//this functions allows the user to view all roles by quering the db
function viewRole() {
  db.query(
    "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id",
    function (err, result) {
      if (err) throw err;
      console.table("Roles", result);
      runSearch();
    }
  );
}

//this function allows the user to add employees by completing each prompt for the info this then gets inserted into the correct table
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
          //this then gets the role id which is an integar and turn it into a string, this then gets inserted into the correct table with a confiration in the console log
          .then(function (answer) {
            var getRoleId = String(answer.role).split("-");
            var getReportingToId = String(answer.reportingTo).split("-");
            var query = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                 VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${getReportingToId[0]}')`;
            db.query(query, function (err, res) {
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

//this allows the user to add a department and inserts it into the correct db eith a console log which takes the user input and outputs a confirmation
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
            db.query(query, function (err, res) {
              console.log(`-------new department added: ${answer.dept}-------`);
            });
            runSearch();
          });
      });
    });
  });
}

//this function allows the user to add a role once they have completed the prompts for the information
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
          //this then gets the role id which is an integar and turn it into a string, this then gets inserted into the correct table with a confiration in the console log
          .then(function (answer) {
            console.log(`${answer.role}`);
            var getDeptId = String(answer.dept).split("-");
            var query = `INSERT INTO role (title, salary, department_id)
                  VALUES ('${answer.role}','${answer.salary}','${getDeptId[0]}')`;
            db.query(query, function (err, res) {
              console.log(`<br>-----new role ${answer.role} added!------`);
            });
            runSearch();
          });
      });
    });
  });
}

//this allows the user to delete a department once they complete the prompts
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
      //once the prompts are completed we turn the deparment id into a string then query the database to tell it where to delete from
      .then(function (answer) {
        var getDeptId = String(answer.dept).split("-");
        var query = `DELETE FROM department WHERE id = '${getDeptId[0]}'`;
        db.query(query, function (err, res) {
          //we have also added an error handler and also a confirmation console log
          if (err) throw err;
          console.log(`Department deleted successfully!`);
        });
        runSearch();
      });
  });
}

//this allows the user to delete a role once they have completed the prompt
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
      //this then function gets the role id and changes it to a string and then queries the db to tell it where to delete from
      .then(function (answer) {
        var getRoleId = String(answer.role).split("-");
        var query = `DELETE FROM role WHERE id = '${getRoleId[0]}'`;
        db.query(query, function (err, res) {
          if (err) throw err;
          console.log(`Role deleted successfully!`);
        });
        runSearch();
      });
  });
}

//this allows the user to delete an employee once they have completed the prompts
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
        var query = `DELETE FROM employees WHERE id = '${getEmployeeId[0]}'`;
        db.query(query, function (err, res) {
          if (err) throw err;
          console.log(`Employee deleted successfully!`);
        });
        runSearch();
      });
  });
}

//This function tells the db to select all roles available and then creates an array containing the id and title. We pass the array of choices back to the callback function
function searchRole(callback) {
  db.query("SELECT * FROM role", function (err, result) {
    if (err) throw err;
    const roleChoices = result.map((role) => ({
      name: `${role.id} - ${role.title}`,
      value: role.id,
    }));
    callback(roleChoices);
  });
}

//This function tells the db to select all employees available and then creates an array containing the id and title. We pass the array of choices back to the callback function
function searchEmployee(callback) {
  db.query("SELECT * FROM employees", function (err, result) {
    if (err) throw err;
    const employeeChoices = result.map((employee) => ({
      name: `${employee.id} - ${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    callback(employeeChoices);
  });
}

//This function tells the db to select all departments available and then creates an array containing the id and title. We pass the array of choices back to the callback function
function searchDepartment(callback) {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    const departmentChoices = result.map((department) => ({
      name: `${department.id} - ${department.name}`,
      value: department.id,
    }));
    callback(departmentChoices);
  });
}

//This function tells the db to select all managers available and then creates an array containing the id and title. We pass the array of choices back to the callback function
function searchManager(callback) {
  db.query(
    "SELECT * FROM employees WHERE manager_id IS NOT NULL",
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

//This function allows the user to update an employee role by taking their input and quering the db to update set role id's. 
function updateEmployeeRole() {
  searchEmployee(function (employeeChoices) {
    searchRole(function (roleChoices) {
      inquirer
        .prompt([
          {
            name: "employeeId",
            type: "list",
            message: "Select the employee to update the role:",
            choices: employeeChoices,
          },
          {
            name: "newRoleId",
            type: "list",
            message: "Select the new role for the employee:",
            choices: roleChoices,
          },
        ])
        .then(function (answers) {
          const employeeId = answers.employeeId;
          const newRoleId = answers.newRoleId;
          const query = "UPDATE employees SET role_id = ? WHERE id = ?";
          const values = [newRoleId, employeeId];

          db.query(query, values, function (err, result) {
            if (err) throw err;
            console.log("Employee role updated successfully!");
            runSearch();
          });
        });
    });
  });
}

//This function allows the user to update an employees manager role by taking their input and quering the db to update set role id's. 
function updateManager() {
  searchEmployee(function (employeeChoices) {
    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Select the employees to update the manager:",
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
              const query = "UPDATE employees SET manager_id = ? WHERE id = ?";
              const values = [managerId, employeeId];

              db.query(query, values, function (err, result) {
                if (err) throw err;
                console.log(`Employee manager updated successfully!`);
                runSearch();
              });
            });
        });
      });
  });
}

//this function allows the user to exit the programme
function exitProgram() {
  inquirer
    .prompt({
      name: "confirm",
      type: "confirm",
      message: "Are you sure you want to exit?",
    })
    .then((answer) => {
      if (answer.confirm) {
        console.log("Thanks for using Employee Manager!");
        process.exit();
      } else {
        runSearch();
      }
    });
}

//this calls the art after we have run a time delay on the runSearch function so the art has time to load before the main menu
art();
setTimeout(() => {
  runSearch();
}, 200);
