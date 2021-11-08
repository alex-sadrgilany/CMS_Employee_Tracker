const mysql = require("mysql2");

// connect to the sql database
const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password123!",
        database: "employee_tracker"
    },
    console.log("Connected to the employee_tracker database!")
);

module.exports = db;