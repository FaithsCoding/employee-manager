INSERT INTO department(name) VALUES 
  ('Management'),
  ('Engineering'),
  ('Accounting'),
  ('Marketing'),
  ('Human Resources');


INSERT INTO role(title, salary, department_id) VALUES
  ('Manager', 5000000, 1),
  ('Engineer', 1000000, 2),
  ('Accountant', 4000000, 3),
  ('Designer', 3000000, 4),
  ('Administration', 2000000, 5);

  INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
  ('Natasha', 'Dixon', 1, 1),
  ('Mitchell', 'Garza', 2, 1),
  ('Veronica', 'Bowers', 4, 1),
  ('Woody', 'Wall', 3, 1),
  ('Isabella', 'Short', 5, 1),
  ('Lucy', 'Lbarra', 2, 1),
  ('Terence', 'Roberts', 3, 1),
  ('Jasmine', 'Villegas', 1, 1),
  ('Nial', 'Duncan', 1, 1);