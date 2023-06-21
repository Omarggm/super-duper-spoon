const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

// create the connection to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log("connected to the employee_db database.")
);

// call the function to start the app
startApp();

// function to start the app
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

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

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

function addRole() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the emnployee's first name.",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the employee's last name.",
      },
      {
        name: "role",
        type: "list",
        message: "Select the employee's role.",
        choices: roles.map((role) => role.title),
      },
      {
        name: "manager",
        type: "list",
        message: "Enter the employee's manager.",
        choices: [
          "None",
          ...employees.map(
            (employee) => `${employee.first_name} ${employee.last_name}`
          ),
        ],
      },
    ])
    .then((answer) => {
      const role = roles.find((role) => role.title === answer.role);
      const managerName = answer.manager.split(" ");
      let managerId = null;
      if (answer.manager !== "None") {
        const manager = employees.find(
          (employee) =>
            employee.first_name === managerName[0] &&
            employee.last_name === managerName[1]
        );
        managerId = manager.id;
      }
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
          console.log("Employee added succesfully!");
          startApp();
        }
      );
    });
}
