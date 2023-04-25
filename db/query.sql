
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


function updateRole() {
  lookupEmployee(function (employeeChoices) {
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

        lookupRole(function (roleChoices) {
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