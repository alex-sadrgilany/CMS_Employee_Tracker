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
            "All Employees",
            "Employees by Manager",
            "Employees by Department",
            "Budget by Department"
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
        name: "delete",
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
                return console.log(chalk.red("You must enter a department!"));
            }
        }
    }
];

module.exports = { startMenuQuestions, viewMenuQuestions, addMenuQuestions, updateMenuQuestions, deleteMenuQuestions, addDepartmentQuestions };