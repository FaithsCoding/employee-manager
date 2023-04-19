--KEY 
--DB = DATABASE 

--deletes the previous db if it has the same name
DROP DATABSE IF EXISTS employee_manager;
--creates a database with that name
CREATE DATABSE employee_manager;

--makes sure you're on your current DB
USE employee-employee_manager;

--creates a table for employee
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
);

