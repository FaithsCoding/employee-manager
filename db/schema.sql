DROP DATABASE IF EXISTS employee_manager;
CREATE DATABASE employee_manager;
USE employee_manager;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO department(name)
VALUES ('Management'),
       ('Engineering'),
       ('Accounting'),
       ('Marketing'),
       ('Human Resources');
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);
INSERT INTO role(title, salary, department_id) VALUES('Manager', 5000000, 1);
INSERT INTO role(title, salary, department_id) VALUES('Engineer', 1000000, 2);
INSERT INTO role(title, salary, department_id) VALUES('Accountant', 4000000, 3);
INSERT INTO role(title, salary, department_id) VALUES('Designer', 3000000, 4);
INSERT INTO role(title, salary, department_id) VALUES('Administration', 2000000, 5);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Natasha", "Dixon", 1, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Mitchell", "Garza", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Veronica", "Bowers", 4, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Woody", "Wall", 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Isabella", "Short", 5, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Lucy", "Lbarra", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Terence", "Roberts", 3, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Jasmine", "Villegas", 1, 1 );
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Nial", "Duncan", 1, 1);