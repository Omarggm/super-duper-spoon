// Importing required modules
const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 3001;
const app = express();

// Load environment variables from .env file
dotenv.config();

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// call the function to start the app
startApp();

// This function starts the application and prompts the user with a list of actions to choose from.
async function startApp() {
  return inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Update an employee role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}


// This function retrieves and displays all departments from the database.
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}


// This function retrieves and displays all roles from the database.
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}


// This function retrieves and displays all employees from the database.
function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err, res) {
          if (err) throw err;
          console.log("Department added!");
          startApp();
        }
      );
    });
}


// This function adds a new department to the database.
function addEmployee() {
  // Prompt for employee details
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the employee's first name.",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the employee's last name.",
      },
    ])
    .then((answer) => {
      // Retrieve roles from the database using the getRoles() function
      getRoles(function (roles) {
        // Create a list of role titles for the prompt choices
        const roleChoices = roles.map((role) => role.title);
        
        // Prompt for role selection
        inquirer
          .prompt([
            {
              name: "role",
              type: "list",
              message: "Select the employee's role.",
              choices: roleChoices,
            },
          ])
          .then((roleAnswer) => {
            // Find the role object based on the selected role title
            const role = roles.find(
              (role) => role.title === roleAnswer.role
            );

            // Retrieve employees from the database using the getEmployees() function
            getEmployees(function (employees) {
              // Create a list of employee names for the prompt choices
              const employeeChoices = [
                "None",
                ...employees.map(
                  (employee) => `${employee.first_name} ${employee.last_name}`
                ),
              ];
              
              // Prompt for manager selection
              inquirer
                .prompt([
                  {
                    name: "manager",
                    type: "list",
                    message: "Enter the employee's manager.",
                    choices: employeeChoices,
                  },
                ])
                .then((managerAnswer) => {
                  const managerName = managerAnswer.manager.split(" ");
                  let managerId = null;
                  if (managerAnswer.manager !== "None") {
                    // Find the manager object based on the selected manager name
                    const manager = employees.find(
                      (employee) =>
                        employee.first_name === managerName[0] &&
                        employee.last_name === managerName[1]
                    );
                    managerId = manager.id;
                  }

                  // Insert the employee into the database
                  connection.query(
                    "INSERT INTO employee SET ?",
                    {
                      first_name: answer.firstName,
                      last_name: answer.lastName,
                      role_id: role.id,
                      manager_id: managerId,
                    },
                    function (err, res) {
                      if (err) throw err;
                      console.log("Employee added successfully!");
                      startApp();
                    }
                  );
                });
            });
          });
      });
    });
}


// This function adds a new role to the database.
function addRole() {
  // Prompt for role details
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
      },
    ])
    .then((answer) => {
      // Retrieve departments from the database using the getDepartments() function
      getDepartments(function (departments) {
        // Create a list of department names for the prompt choices
        const departmentChoices = departments.map((department) => department.name);
        
        // Prompt for department selection
        inquirer
          .prompt([
            {
              name: "department",
              type: "list",
              message: "Select the department for this role.",
              choices: departmentChoices,
            },
          ])
          .then((departmentAnswer) => {
            // Find the department object based on the selected department name
            const department = departments.find(
              (department) => department.name === departmentAnswer.department
            );
            
            // Insert the role into the database
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: answer.role,
                salary: answer.salary,
                department_id: department.id,
              },
              function (err, res) {
                if (err) throw err;
                console.log("Role added successfully!");
                startApp();
              }
            );
          });
      });
    });
}


// This function updates the role of an employee in the database.
function updateEmployeeRole() {
  connection.query("SELECT * FROM employee", function (err, employees) {
    if (err) throw err;
    connection.query("SELECT * FROM role", function (err, roles) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select the employee to update.",
            choices: employees.map(
              (employee) => `${employee.first_name} ${employee.last_name}`
            ),
          },
          {
            name: "role",
            type: "list",
            message: "Select the employee's new role.",
            choices: roles.map((role) => role.title),
          },
        ])
        .then((answer) => {
          const employeeName = answer.employee.split(" ");
          const employee = employees.find(
            (employee) =>
              employee.first_name === employeeName[0] &&
              employee.last_name === employeeName[1]
          );
          const role = roles.find((role) => role.title === answer.role);
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                role_id: role.id,
              },
              {
                id: employee.id,
              },
            ],
            function (err, res) {
              if (err) throw err;
              console.log("Employee role updated succesfully!");
              startApp();
            }
          );
        }
        );
    });
  });
}


// Function to retrieve departments from the database
function getDepartments(callback) {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    callback(res);
  });
}


// Function to retrieve roles from the database
function getRoles(callback) {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    callback(res);
  });
}


// Function to retrieve employees from the database
function getEmployees(callback) {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    callback(res);
  });
}
