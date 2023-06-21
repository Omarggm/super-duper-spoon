# Employee Management App
This is a command-line application that allows you to manage employees, departments, and roles within your company. The application is built using Node.js and utilizes the following libraries:

- mysql2: A Node.js driver for MySQL that provides an easy way to connect to a MySQL database and perform database operations.
- inquirer: A collection of common interactive command-line user interfaces that provides a set of prompts for user input.
- express: A web application framework for Node.js used to handle HTTP requests and responses.

## Installation
To run the Employee Management App, follow these steps:

1. Make sure you have Node.js installed on your machine. You can download it from the official website: Node.js.

2. Clone the repository or download the source code of the application.

3. Open a terminal or command prompt and navigate to the directory where the application files are located.

4. Install the required dependencies by running the following command:

Copy code

```npm install```

5. Set up a MySQL database server and create a database named employee_db.

6. Open the index.js file in a text editor and update the database connection configuration in the connection variable to match your MySQL server settings:

javascript

Copy code

```const connection = mysql.createConnection(
  {
    host: "yourLocalHost",
    user: "yourUsername",
    password: "yourPassword",
    database: "employee_db",
  },
  console.log("connected to the employee_db database.")
);
```

7. Save the changes to the index.js file.

8. Start the application by running the following command:

Copy code

`node index.js`

## Usage
Once the application is running, you will be presented with a list of actions to choose from. Here are the available options:

- **View all departments**: Displays a table of all departments in the database.

- **View all roles**: Displays a table of all roles in the database.

- **View all employees**: Displays a table of all employees in the database.

- **Add a department**: Prompts you to enter the name of a new department and adds it to the database.

- **Add a role**: Prompts you to enter the details of a new role, including the name, salary, and department. Adds the role to the database.

- **Add an employee**: Prompts you to enter the details of a new employee, including the first name, last name, role, and manager. Adds the employee to the database.

- **Update an employee role**: Allows you to update the role of an existing employee. You can select the employee and their new role from the available choices.

- **Exit**: Ends the application and closes the database connection.

After each action is performed, the application will return to the main menu for you to choose another action or exit the application.

## Contributing
Contributions to the Employee Management App are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License
This project is licensed under the MIT License. Feel free to use and modify the code as per the license terms.

Copyright 2023 <COPYRIGHT Omar Garcia>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
