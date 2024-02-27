
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const figlet = require('figlet');
const connection = require('./db/connection');
const fs = require('fs');

figlet.text('Welcome To Employee Manager', {
    font: 'Standard',
}, function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        return;
    }

    const gradientText = gradient.pastel.multiline(data);

    console.log(gradientText);
});

// Function to start the app on node

function menu() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }]).then(({ choice }) => {
        switch (choice) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;

            case 'Quit':
                connection.end();
                break;
        }
    })
};

menu()


// Function called to view all the departments in a table
function viewDepartments() {
    connection.query("SELECT * FROM departments", (err, data) => {
        if (err) throw err;
        console.table(data)
        menu()
    })
};


// Function called to view the roles and the departments they are linked to 
function viewRoles() {

    connection.query("SELECT roles.id, roles.title, departments.department_name AS department_name, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id;", (err, data) => {
        if (err) throw err;
        console.table(data)
        menu()
    })
};

// Function to view the employee details
function viewEmployees() {

    connection.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
    AS "last name", roles.title, departments.department_name AS departments, roles.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN roles
    ON employee.role_id = roles.id
    LEFT JOIN departments
    ON roles.department_id = departments.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`, (err, data) => {
        if (err) throw err;
        console.table(data)
        menu()
    })
};

// Function to add a department
function addDepartment() {
    inquirer.prompt({
        name: 'department_name',
        message: 'Please enter the department name: '
    }).then(answer => {

        // "shoes); SELECT SSN CNN FROM users;"
        // connection.query("INSERT INTO dogs (dogName, dogBreed) VALUES (?, ?);", ["Stoic", "German Shepard Dog"], (err, data) => {
        //     if (err) throw err;

        //     menu()
        // })
        connection.query(`INSERT INTO departments (department_name) VALUES ('${answer.name}')`, (err, data) => {
            if (err) throw err;

            menu()
        })
    })
};

// Function to add a role
function addRole() {
    connection.query(`SELECT * FROM departments;`, (err, data) => {
        if (err) {
            console.error('Error fetching departments:', err);
            return;
        }

        console.log('Department data:', data);

        const departmentOptions = data.map(({ id, department_name }) => ({
            name: department_name,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'Please select the department for the new role: ',
                choices: departmentOptions
            },
            {
                type: 'text',
                name: 'new_role',
                message: 'Please enter the name of the new role: ',
            },
            {
                type: 'text',
                name: 'salary',
                message: 'Please enter the salary for the new role: ',
            },
        ]).then(answers => {
            connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.new_role}','${answers.salary}','${answers.department_id}')`, (err, data) => {
                if (err) {
                    console.error('Error adding role:', err);
                    return;
                }
                console.log('The new role is added successfully');

                menu(); // Assuming menu() prompts the user for the next action
            });
        });
    });
}


// Function to add an employee

function addEmployee() {
    connection.query('SELECT * FROM roles;', (err, roleData) => {
        if (err) throw err;
        const roleOptions = roleData.map(role => role.title);

        connection.query('SELECT * FROM departments;', (err, departmentData) => {
            if (err) throw err;
            const departmentOptions = departmentData.map(department => department.name);

            connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL', (err, employeeData) => {
                if (err) throw err;
                const managerOptions = employeeData.map(employee => {
                    return {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    };
                });
                managerOptions.unshift({ name: 'None', value: null });

                inquirer.prompt([
                    {
                        type: 'text',
                        name: 'first_name',
                        message: 'Please enter the Employee\'s First Name: ',
                    },
                    {
                        type: 'text',
                        name: 'last_name',
                        message: 'Please enter the Employee\'s Last Name: ',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Please choose the role of the employee from the following list: ',
                        choices: roleOptions,
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please choose the department of the employee from the following list: ',
                        choices: departmentOptions,
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Please choose the manager for the employee: ',
                        choices: managerOptions,
                    }
                ]).then(answers => {
                    try {
                        const selectedRole = roleData.find(role => role.title === answers.role);
                        const selectedDepartment = departmentData.find(department => department.name === answers.department);

                        connection.query(
                            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ('${answers.first_name}', '${answers.last_name}', ${selectedRole.id}, ${answers.manager});`,
                            (err, data) => {
                                if (err) {
                                    console.error('Error adding employee:', err);
                                    return;
                                }
                                console.log('Employee added successfully');
                                viewEmployees();
                                menu();
                            }
                        );
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
            });
        });
    });
}

// Function to update an employee role
function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, data) => {
        const employeeOptions = data.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))

        connection.query('SELECT * FROM role r JOIN department d ON r.department_id = d.id', (err, data) => {
            const roleOptions = data.map(({ id, title, name }) => ({
                name: `${title} / ${name}`,
                value: id
            }))

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'please select from the following list: ',
                    choices: employeeOptions
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Please choose the new role for the employee ',
                    choices: roleOptions
                },

            ])
                .then(answers => {
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answers.role_id, answers.employee_id], (err, data) => {
                        if (err) throw err;
                        console.log('The new role is updated successfully');
                        viewEmployees()
                        menu()
                    });
                });
        });

    });
}

module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment }