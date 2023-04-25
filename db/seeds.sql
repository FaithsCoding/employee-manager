USE employee_manager;
INSERT INTO department(id, name) VALUES 
  (1, 'Management'),
  (2, 'Engineering'),
  (3, 'Accounting'),
  (4, 'Marketing'),
  (5, 'Human Resources');


INSERT INTO role(id, title, salary, department_id) VALUES
  (1, 'Manager', 5000000, 1),
  (2, 'Engineer', 1000000, 2),
  (3, 'Accountant', 4000000, 3),
  (4, 'Designer', 3000000, 4),
  (5, 'Administration', 2000000, 5);

  INSERT INTO employees(id, first_name, last_name, role_id, manager_id) VALUES
  (1, 'Natasha', 'Dixon', 1, NULL),
  (2, 'Mitchell', 'Garza', 2, 1),
  (3, 'Veronica', 'Bowers', 4, 1),
  (4, 'Woody', 'Wall', 3, 1),
  (5, 'Isabella', 'Short', 5, 1),
  (6, 'Lucy', 'Lbarra', 2, 1),
  (7, 'Terence', 'Roberts', 3, 1),
  (8, 'Jasmine', 'Villegas', 1, 1),
  (9, 'Nial', 'Duncan', 1, 1);