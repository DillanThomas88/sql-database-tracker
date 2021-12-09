USE CMS_db;

INSERT INTO departments (department_name)
VALUES ("Administration/Operations"),
       ("Research/Development"),
       ("Marketing/Sales"),
       ("Accounting/Finance"),
       ("Customer Service"),
       ("Human Resources");

INSERT INTO roles (title, salary, department)
VALUES ("Manager", 126000, 1),
       ("Engineer", 112000, 2),
       ("Business Analyst", 105000, 2),
       ("Sales Represenative", 96000, 3),
       ("Marketing Specialist", 82000, 3),
       ("Accountant", 74000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Dillan", "Mansor", 1, 1);
       
