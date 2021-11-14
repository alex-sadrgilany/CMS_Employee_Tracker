const inquirier = require("inquirer");
const db = require("./config/connection");
const cTable = require("console.table");
const inquirer = require("inquirer");
const e = require("express");

db.connect(err => {
    if (err) {
        throw err;
    }

    console.log("Database connected!");
});

const startMenuQuestions = [
    {
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: [
            "View",
            "Add",
            "Update",
            "Delete",
            "Exit"
        ]
    }
];

const viewMenuQuestions = [
    {
        type: "list",
        name: "view",
        message: "What would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees"
        ]
    }
];

const addMenuQuestions = [
    {
        type: "list",
        name: "add",
        message: "What would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
    }
];

const updateMenuQuestions = [
    {
        type: "list",
        name: "update",
        message: "What would you like to update?",
        choices: [
            "Employee's role",
            "Employee's manager"
        ]
    }
];

const deleteMenuQuestions = [
    {
        type: "list",
        name: "update",
        message: "What would you like to delete?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
    }
];

const addDepartmentQuestions = [
    {
        type: "input",
        name: "departmentName",
        message: "What is the name of the new department?",
        validate: dptInput => {
            if (dptInput) {
                return true;
            }
            else {
                return console.log("You must enter a department!");
            }
        }
    }
];

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

            if (answers.view === "Employees") {
                let joinSql = `SELECT employee.id,
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
                
                db.query(joinSql, (err, data) => {
                    if (err) throw err;

                    console.table(data);
                    promptUser();
                });
            }
            else if (answers.view === "Roles") {
                let joinSql2 = `SELECT role.title,
                                role.id AS role_id,
                                role.salary,
                                department.name AS department
                                FROM role
                                INNER JOIN department
                                ON role.department_id = department.id
                                ORDER BY role_id ASC`;
                        
                db.query(joinSql2, (err, data) => {
                    if (err) throw err;

                    console.table(data);
                    promptUser();
                });
            }
            else {
                let joinSql3 = `SELECT * FROM department
                                ORDER BY id ASC`;
                db.query(joinSql3, (err, data) => {
                    if (err) throw err;

                    console.table(data);
                    promptUser();
                });
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
















const addDepartment = () => {
    inquirer.prompt(addDepartmentQuestions)
        .then(answers => {
            let addDptSql = `INSERT INTO department (name)
                                VALUES ("${answers.departmentName}")`;
            
            db.query(addDptSql, (err, data) => {
                if (err) throw err;

                console.log(`Your new department of ${answers.departmentName} has been added to the database!`);
                promptUser();
            });
        });
};

const addRole = () => {
    let departments = [];
    let dptSql = `SELECT * FROM department`;

    db.query(dptSql, (err, data) => {
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
                    console.log("You must enter a role!");
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the new Role?",
            validate: salaryInput => {
                if (isNaN(salaryInput)) {
                    console.log("You must enter an integer with a maximum of 8 digits plus 2 decimals if desired!");
                }
                else if (salaryInput > 99999999.99) {
                    console.log("The maximum salary you can enter is 99999999.99!");
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
            let newDptSql = `SELECT id FROM department
                                WHERE name="${answers.roleDepartment}"`;

            db.query(newDptSql, (err, data) => {
                if (err) throw err;
                let department_id = data[0].id;

                let roleSql = `INSERT INTO role (title, salary, department_id)
                            VALUES ("${answers.title}", ${answers.salary}, ${department_id})`;

                db.query(roleSql, (err, data) => {
                    if (err) throw (err);

                    console.log(`Your new role has been added to the database with a title of ${answers.title}, salary of $${answers.salary}, and belonging to the department of ${answers.roleDepartment}`);

                    promptUser();
                });
            });
        });
};

const addEmployee = () => {
    let employees = ["None"];
    let roles = [];

    let roleSql = `SELECT * FROM role`;
    db.query(roleSql, (err, data) => {
        if (err) throw err;

        for (i = 0; i < data.length; i++) {
            roles.push(data[i].title);
        };

        let employeeSql = `SELECT * FROM employee`;
        db.query(employeeSql, (data, err) => {
            if (err) throw err;

            for (i = 0; i < data.length; i++) {
                let employeeName = data[i].first_name + " " + data[i].last_name;
                employees.push(employeeName);
            };
        });
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
                    console.log("You must enter a first name!");
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
                    console.log("You must enter a last name!");
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
            let newRoleSql = `SELECT id FROM role
                                WHERE title="${answers.employeeRole}"`;

            db.query(newRoleSql, (err, data) => {
                if (err) throw err;

                let role_id = data[0].id;
                
                if (answers.employeeManager === "None") {
                    let noManagerSql = `INSERT INTO employee (first_name, last_name, role_id)
                                        VALUES ("${answers.firstName}", "${answers.lastName}", ${role_id})`;

                    db.query(noManagerSql, (err, data) => {
                        if (err) throw err;

                        console.log(`You have added ${answers.firstName} ${answers.lastName}, with a role of ${answers.employeeRole}, without a manager to the database!`);
                        promptUser();
                    })
                }
                else {
                    let splitName = answers.employeeManager.split(" ");
                    let newEmployeeSql = `SELECT manager_id FROM employee
                                            WHERE first_name="${splitName[0]}"
                                            AND last_name="${splitName[1]}"`;
                    db.query(newEmployeeSql, (err, data) => {
                        if (err) throw err;
    
                        let manager_id = data[0].id;
    
                        let finalEmployeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES ("${splitName[0]}", "${splitName[1]}", ${role_id}, ${manager_id})`;
                                        
                        db.query(finalEmployeeSql, (err, data) => {
                            if (err) throw err;

                            console.log(`You have added ${answers.employeeManager}, with a role of ${answers.employeeRole}, and a manager of to the database!`);
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
    let employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;
        console.log(data.length);

        for (i = 0; i < data.length; i++) {
            let employeeName = data[i].first_name + " " +  data[i].last_name;
            employees.push(employeeName);
        };
        console.log(employees);
        

        let roleSql = `SELECT * FROM role`;
        db.query(roleSql, (err, data) => {
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
                    let findIdSql = `SELECT id FROM role
                                        WHERE title="${answers.chooseRole}"`;
                    db.query(findIdSql, (err, data) => {
                        if (err) throw err;

                        let role_id = data[0].id;

                        let splitName = answers.chooseEmployee.split(" ");
                        let finalSql = `UPDATE employee
                                            SET role_id=${role_id}
                                            WHERE first_name="${splitName[0]}"
                                            AND last_name="${splitName[1]}"`;

                        db.query(finalSql, (err, data) => {
                            if (err) throw err;

                            console.log(`You have successfully updated ${answers.chooseEmployee}'s role to be ${answers.chooseRole}!`);
                            promptUser();
                        });
                    });
                });
        });
    });
};


promptUser();





