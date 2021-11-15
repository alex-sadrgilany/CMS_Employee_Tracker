const db = require("../config/connection");
const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require("console.table");
const { startMenuQuestions, viewMenuQuestions, addMenuQuestions, 
        updateMenuQuestions, deleteMenuQuestions, addDepartmentQuestions } = require("./inquirer-questions");

const promptUser = () => {
    inquirer.prompt(startMenuQuestions)
        .then(answers => {
            switch(answers.start) {
                case "View":
                    promptUserView();
                    break;
                case "Add":
                    promptUserAdd();
                    break;
                case "Update":
                    promptUserUpdate();
                    break;
                case "Delete":
                    promptUserDelete();
                    break;
                case "Exit":
                    goodbye();
                    break;
            };
        });
};

const promptUserView = () => {
    inquirer.prompt(viewMenuQuestions)
        .then(answers => {
            switch(answers.view) {
                case "Departments":
                    viewDepartments();
                    break;
                case "Roles":
                    viewRoles();
                    break;
                case "All Employees":
                    viewEmployees();
                    break;
                case "Employees by Manager":
                    viewByManager();
                    break;
                case "Employees by Department":
                    viewByDept();
                    break;
                case "Budget by Department":
                    viewBudgetByDept();
                    break;
            };
        });
};

const promptUserAdd = () => {
    inquirer.prompt(addMenuQuestions)
        .then(answers => {
            switch(answers.add) {
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;
            };
        });
};

const promptUserUpdate = () => {
    inquirer.prompt(updateMenuQuestions)
        .then(answers => {
            switch(answers.update) {
                case "Employee's role":
                    updateEmployeeRole();
                    break;
                case "Employee's manager":
                    updateEmployeeManager();
                    break;
            };
        });
};

const promptUserDelete = () => {
    inquirer.prompt(deleteMenuQuestions)
        .then(answers => {
            switch(answers.delete) {
                case "Department":
                    deleteDepartment();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Employee":
                    deleteEmployee();
                    break;
            };
        });
};

const viewDepartments = () => {
    let sql = `SELECT * FROM department
                ORDER BY id ASC`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        console.table(data);
        promptUser();
    });
};

const viewRoles = () => {
    let sql = `SELECT role.title,
                role.id AS role_id,
                role.salary,
                department.name AS department
                FROM role
                INNER JOIN department
                ON role.department_id = department.id
                ORDER BY role_id ASC`;
                        
    db.query(sql, (err, data) => {
        if (err) throw err;

        console.table(data);
        promptUser();
    });
};

const viewEmployees = () => {
    let sql = `SELECT employee.id,
                    employee.first_name,
                    employee.last_name,
                    role.title,
                    department.name AS department,
                    role.salary,
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employee
                    LEFT JOIN role
                    ON employee.role_id = role.id
                    LEFT JOIN department
                    ON role.department_id = department.id
                    LEFT JOIN employee manager
                    ON employee.manager_id = manager.id`;
                
    db.query(sql, (err, data) => {
        if (err) throw err;

        console.table(data);
        promptUser();
    });
};

const viewByManager = () => {
    let managers = [];
    let sqlData = [];
    let chosenManagerId;
    let sql = `SELECT * FROM employee
                WHERE (id IN (SELECT manager_id FROM employee))`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            let managerName = data[i].first_name + " " + data[i].last_name;
            managers.push(managerName);
            sqlData.push(data[i]);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "empsByManager",
                message: "Which manager would you like to view employees by?",
                choices: managers
            }
        ])
            .then(answers => {
                for (i = 0; i < sqlData.length; i++) {
                    let managerName = sqlData[i].first_name + " " + sqlData[i].last_name;
                    if (managerName === answers.empsByManager) {
                        chosenManagerId = sqlData[i].id;
                        break;
                    }
                };

                let sql = `SELECT * FROM employee
                            WHERE manager_id = (SELECT id
                                                FROM employee
                                                WHERE id=${chosenManagerId})`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    console.table(data);
                    promptUser();
                });
            });
    });
};

const viewByDept = () => {
    let departments = [];
    let sql = `SELECT * FROM department`;

    db.query(sql, (err,data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            departments.push(data[i].name);
        };

        inquirer.prompt([
            {
                type: "list",
                name: "viewByDept",
                message: "Which department would you like to view employees by?",
                choices: departments
            }
        ])
            .then(answers => {
                let sql = `SELECT * FROM employee
                            WHERE role_id IN (SELECT id
                                            FROM role
                                            WHERE department_id IN (SELECT id
                                                                    FROM department
                                                                    WHERE name = "${answers.viewByDept}"))`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    if (data.length > 0) {
                        console.table(data);
                    }
                    else {
                        console.log(chalk.green("There are no employees currently in this department!"));
                    }
                    promptUser();
                });
            });
    });
};

const viewBudgetByDept = () => {
    let departments = [];
    let sql = `SELECT * FROM department`;

    db.query(sql, (err,data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            departments.push(data[i].name);
        };

        inquirer.prompt([
            {
                type: "list",
                name: "viewByDept",
                message: "Which department would you like to view budget by?",
                choices: departments
            }
        ])
            .then(answers => {
                let sql = `SELECT id, 
                            SUM(salary)
                            FROM role
                            WHERE department_id IN (SELECT id
                                                    FROM department
                                                    WHERE name = "${answers.viewByDept}")
                            AND id IN (SELECT role_id
                                        FROM employee)`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    if (data[0].id != null) {
                        console.table(data);
                    }
                    else {
                        console.log(chalk.green("There are currently no employees in that department so the salary is $0!"));
                    }
                    promptUser();
                });
            });
    });
};

const addDepartment = () => {
    inquirer.prompt(addDepartmentQuestions)
        .then(answers => {
            let sql = `INSERT INTO department (name)
                                VALUES ("${answers.departmentName}")`;
            
            db.query(sql, (err, data) => {
                if (err) throw err;

                console.log(chalk.green(`Your new department of ${answers.departmentName} has been added to the database!`));
                promptUser();
            });
        });
};

const addRole = () => {
    let departments = [];
    let sql = `SELECT * FROM department`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            departments.push(data[i].name);
        };
    });

    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the new Role?",
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }
                else {
                    console.log('\x1b[31m', "You must enter a role!");
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the new Role?",
            validate: salaryInput => {
                if (isNaN(salaryInput)) {
                    console.log('\x1b[31m', "You must enter an integer with a maximum of 8 digits plus 2 decimals if desired!");
                }
                else if (salaryInput > 99999999.99) {
                    console.log('\x1b[31m', "The maximum salary you can enter is 99999999.99!");
                }
                else {
                    return true;
                }
            }
        },
        {
            type: "list",
            name: "roleDepartment",
            message: "Which Department does this new Role belong to?",
            choices: departments
        }
    ])
        .then(answers => {
            let sql = `SELECT id FROM department
                                WHERE name="${answers.roleDepartment}"`;

            db.query(sql, (err, data) => {
                if (err) throw err;
                let department_id = data[0].id;

                let sql = `INSERT INTO role (title, salary, department_id)
                            VALUES ("${answers.title}", ${answers.salary}, ${department_id})`;

                db.query(sql, (err, data) => {
                    if (err) throw (err);

                    console.log(chalk.green(`Your new role has been added to the database with a title of ${answers.title}, salary of $${answers.salary}, and belonging to the department of ${answers.roleDepartment}`));

                    promptUser();
                });
            });
        });
};

const addEmployee = () => {
    let employees = ["None", ];
    let roles = [];

    let sql = `SELECT * FROM role`;
    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        };
    });

    let sql2 = `SELECT * FROM employee`;
    db.query(sql2, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            let employeeName = data[i].first_name + " " + data[i].last_name;
            employees.push(employeeName);
        };
    });

    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the new employee's first name?",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                }
                else {
                    console.log('\x1b[31m', "You must enter a first name!");
                }
            }
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the new employee's last name?",
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                }
                else {
                    console.log('\x1b[31m', "You must enter a last name!");
                }
            }
        },
        {
            type: "list",
            name: "employeeRole",
            message: "What is your new employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "employeeManager",
            message: "Who is your new employee's manager?",
            choices: employees
        }
    ])
        .then(answers => {
            let sql = `SELECT id FROM role
                                WHERE title="${answers.employeeRole}"`;

            db.query(sql, (err, data) => {
                if (err) throw err;

                let role_id = data[0].id;
                
                if (answers.employeeManager === "None") {
                    let sql = `INSERT INTO employee (first_name, last_name, role_id)
                                        VALUES ("${answers.firstName}", "${answers.lastName}", ${role_id})`;

                    db.query(sql, (err, data) => {
                        if (err) throw err;

                        console.log(chalk.green(`You have added ${answers.firstName} ${answers.lastName}, with a role of ${answers.employeeRole}, without a manager to the database!`));
                        promptUser();
                    })
                }
                else {
                    let splitName = answers.employeeManager.split(" ");
                    let sql = `SELECT id FROM employee
                                            WHERE first_name="${splitName[0]}"
                                            AND last_name="${splitName[1]}"`;
                    db.query(sql, (err, data) => {
                        if (err) throw err;
    
                        let manager_id = data[0].id;
    
                        let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES ("${answers.firstName}", "${answers.lastName}", ${role_id}, ${manager_id})`;
                                        
                        db.query(sql, (err, data) => {
                            if (err) throw err;

                            console.log(chalk.green(`You have added ${answers.firstName}` + ` ` + `${answers.lastName}, with a role of ${answers.employeeRole}, and a manager of ${answers.employeeManager} to the database!`));
                            promptUser();
                        });
                    });
                };
                
            });
        });   
};

const updateEmployeeRole = () => {
    let employees = [];
    let roles = [];
    let sql = `SELECT * FROM employee`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            let employeeName = data[i].first_name + " " +  data[i].last_name;
            employees.push(employeeName);
        };
        
        let sql = `SELECT * FROM role`;
        db.query(sql, (err, data) => {
            if (err) throw err;

            for (i = 0; i < data.length; i++) {
                roles.push(data[i].title);
            }

            inquirer.prompt([
                {
                    type: "list",
                    name: "chooseEmployee",
                    message: "Which employee needs a new role?",
                    choices: employees
                },
                {
                    type: "list",
                    name: "chooseRole",
                    message: "What is their new role?",
                    choices: roles
                }
            ])
                .then(answers => {
                    let sql = `SELECT id FROM role
                                        WHERE title="${answers.chooseRole}"`;
                    db.query(sql, (err, data) => {
                        if (err) throw err;

                        let role_id = data[0].id;

                        let splitName = answers.chooseEmployee.split(" ");
                        let sql = `UPDATE employee
                                            SET role_id=${role_id}
                                            WHERE first_name="${splitName[0]}"
                                            AND last_name="${splitName[1]}"`;

                        db.query(sql, (err, data) => {
                            if (err) throw err;

                            console.log(chalk.green(`You have successfully updated ${answers.chooseEmployee}'s role to be ${answers.chooseRole}!`));
                            promptUser();
                        });
                    });
                });
        });
    });
};

const updateEmployeeManager = () => {
    let employees = [];
    let sql = `SELECT * FROM employee`;

    db.query(sql, (err, data) => {
        if (err) throw err;
        
        for (i = 0; i < data.length; i++) {
            let employeeName = data[i].first_name + " " + data[i].last_name;
            employees.push(employeeName);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "newEmployeeManager",
                message: "Which employee is being assigned a new manager?",
                choices: employees
            },
            {
                type: "list",
                name: "assignedManager",
                message: "Who will be the employee's new manager?",
                choices: employees
            }
        ])
            .then(answers => {
                let employeeSplitName = answers.newEmployeeManager.split(" ");
                let managerSplitName = answers.assignedManager.split(" ");

                let sql = `SELECT id FROM employee
                WHERE first_name="${managerSplitName[0]}"
                AND last_name="${managerSplitName[1]}"`;
        
                db.query(sql, (err, data) => {
                    if (err) throw err;

                    let manager_id = data[0].id;

                    let sql = `UPDATE employee
                                    SET manager_id=${manager_id}
                                    WHERE first_name="${employeeSplitName[0]}"
                                    AND last_name="${employeeSplitName[1]}"`;

                    db.query(sql, (err, data) => {
                        if (err) throw err;

                        console.log(chalk.green(`You have successfully assigned ${answers.newEmployeeManager} a new manager of ${answers.assignedManager}!`));
                        promptUser();
                    });
                });
            });
    });
};

const deleteDepartment = () => {
    let departments = [];
    let sql = `SELECT * FROM department`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            departments.push(data[i].name);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "deleteDpt",
                message: "Which department would you like to delete?",
                choices: departments
            }
        ])
            .then(answers => {
                let sql = `DELETE FROM department
                                WHERE name="${answers.deleteDpt}"`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    console.log(chalk.green(`You have deleted the department of ${answers.deleteDpt} from the database!`));
                    promptUser();
                });
            });
    });
};

const deleteRole = () => {
    let roles = [];
    let sql = `SELECT * FROM role`;

    db.query(sql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "deleteRole",
                message: "Which role would you like to delete?",
                choices: roles
            }
        ])
            .then(answers => {
                let sql = `DELETE FROM role
                                WHERE title="${answers.deleteRole}"`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    console.log(chalk.green(`You have deleted the role of ${answers.deleteRole} from the database!`));
                    promptUser();
                });
            });
    });
};

const deleteEmployee = () => {
    let employees = [];
    let sql = `SELECT * FROM employee`;

    db.query(sql, (err,data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            let employeeName = data[i].first_name + " " + data[i].last_name;
            employees.push(employeeName);
        };

        inquirer.prompt([
            {
                type: "list",
                name: "deleteEmp",
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(answers => {
                let splitName = answers.deleteEmp.split(" ");
                let sql = `DELETE FROM employee
                                WHERE first_name="${splitName[0]}"
                                AND last_name="${splitName[1]}"`;

                db.query(sql, (err, data) => {
                    if (err) throw err;

                    console.log(chalk.green(`You have deleted ${answers.deleteEmp} from the database!`));
                    promptUser();
                });
            });
    });
};

const goodbye = () => {
    console.log(chalk.magenta("Thanks for using this employee tracker!")),
    '\n';
    console.log(chalk.magenta("Disconnecting from database now...Goodbye!"));

    db.end();
};

module.exports = promptUser;