const inquirer = require('inquirer');
// Function to start the application
function startApp() {
  // Prompt the user with options
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    .then(answer => {
      // Based on the user's choice, call the appropriate function
      switch (answer.action) {
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
        case 'Exit':
          connection.end(); // Close the database connection
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  // Execute SQL query to select all departments
  connection.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res); // Display results in a formatted table
    startApp(); // Go back to the main menu
  });
}