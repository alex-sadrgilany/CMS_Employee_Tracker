const inquirer = require("inquirer");

// Start Menu
const startOptions = [
    {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
            "Quit"
        ]
    }
];

//Add Department
const addDepartmentQuestion = [
    {
        type: "input",
        name: "addDepartment",
        message: "What is the name of the new Department?"
    }
];

const addRoleQuestion = [
    {
        type: "input",
        name: "roleName",
        message: "What is the name of the new Role?"
    },
    {
        type: "input",
        name: "salary",
        message: "What is the salary of the new Role?"
    },
    {
        type: "list",
        name: "roleDepartment",
        message: "Which Department does this new Role belong to?",
        // department array here
        choices: ""
    }
];

const addEmployeeQuestion = [
    {
        type: "input",
        name: "firstName",
        message: "What is the new Employee's first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the new Employee's last name?"
    },
    {
        type: "list",
        name: "employeeRole",
        message: "What is your new Employee's Role?",
        // role array here
        choices: ""
    },
    {
        type: "list",
        name: "employeeManager",
        message: "Who is your new Employee's Manager?",
        // manager array here
        choices: ""
    }
];

const updateEmployeeQuestion = [
    {
        type: "list",
        name: "employeeUpdate",
        message: "Which Employee would you like to assign a new Role to?",
        // employee array here
        choices: ""
    },
    {
        type: "list",
        name: "employeeUpdateRole",
        message: "What is this employee's new Role?",
        // role array here
        choices: ""
    }
];

const deleteDepartmentQuestion = [
    {
        type: "list",
        name: "deleteDepartment",
        message: "Which Department would you like to delete?",
        // department array here
        choices: ""
    }
];

const deleteRoleQuestion = [
    {
        type: "list",
        name: "deleteRole",
        message: "Which Role would you like to delete?",
        // role array here
        choices: ""
    }
];

const deleteEmployeeQuestion = [
    {
        type: "list",
        name: "deleteEmployee",
        message: "Which Employee would you like to delete?",
        // employee array here
        choices: ""
    }
];

const promptUser = () => {
    
}
