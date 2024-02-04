const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name'
});

// Connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database.');
});
