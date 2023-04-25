
DROP DATABASE IF EXISTS employee_manager;
CREATE DATABASE employee_manager;
-- Use the database we have created
USE employee_manager;
-- Creates a table for the departments
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) 
);
-- Creates a table for the role
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(60) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE CASCADE
);
-- Creates a table for employees
-- Creates a column called id with a INT (INTEGAR) datatype
-- Primary key sets this column as the primary key for this table
-- AUTO INCREMENT means the new value generated  will be added to this column for each row added to the table
-- VARCHAR specifies max length of characters allows
-- NOT NULL means the column cant be empty
-- FOREIGN KEY creates a relationship between the tole id column and the id column in the role table
-- ON DELETE CASCASE means that if a role in the new table is deleted all rows that reference will also be deleted
-- ON DELETE SET NULL means if the row is deleted the value od the manager id column in any row that refrence will also be NULL
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id)
  REFERENCES role(id) 
  ON DELETE CASCADE,
  manager_id INT,
  FOREIGN KEY (manager_id)
  REFERENCES employees(id)
  ON DELETE SET NULL
);