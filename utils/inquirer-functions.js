const connection = require("../config/connection");

const viewTables = function (tableName) {
    const sql = `SELECT * FROM ${tableName}`;

    connection.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.table(data);
    });
};

const addDepartment = function (departmentName) {
    const sql = `INSERT INTO department (name)
                 VALUES ${departmentName}`;
    
    connection.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(`Your new department of ${departmentName} has been added to the database!`);
    });
};

const addRole = function (title, salary, department_id) {
    let departments = [];
    const departmentsSql = `SELECT * FROM department`;

    connection.query(departmentsSql, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        for (i = 0; i < data.length; i++) {
            departments.push(data[i].name);
        }
    });

    const roleSql = `INSERT INTO role (title, salary, department_id)
                     VALUES (${title}, ${salary}, ${department_id})`;
    
    connection.query(roleSql, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log("Your new role has been added to the database!");
    });
};

const addEmployee = function (first_name, last_name, role_id, manager_id) {
    let roles = [];
    let employees = [];

    
}