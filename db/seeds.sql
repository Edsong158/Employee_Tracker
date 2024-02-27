-- Active: 1708728049218@@127.0.0.1@3306@employee_management_db
INSERT INTO
    departments (department_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Human Resources'),
    ('Legal');

INSERT INTO
    roles (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 160300, 2),
    ('Accountant', 125000, 3),
    ('HR Manager', 90000, 4),
    ('HR advisor', 75000, 4),
    ('Legal Team Lead', 250000, 5),
    ('Lawyer', 190000, 5);

INSERT INTO
    employee (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES
    ('Arvind', 'Green', 1, null),
    ('Rathor', 'Centralperk', 2, 1),
    ('Manish', 'Heller', 3, null),
    ('Viany', 'Tribbiani', 4, 3),
    ('Ramesh', 'Broad', 5,  NULL),
    ('Manisha', 'Gani', 6, 5),
    ('Vicky', 'Bing', 7, null),
    ('Mandira', 'Geller', 8, 7),
    ('Sony', 'Buffay', 9, null),
    ('Samira', 'Banden', 10, 9);

    SELECT * FROM departments;
    SELECT * FROM roles;
    SELECT * FROM employee;
