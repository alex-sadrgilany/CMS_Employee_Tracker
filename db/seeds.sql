INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Accounting"),
    ("Warehouse"),
    ("IT"),
    ("Corporate");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Head of Sales", 90000, 1),
    ("Sales Associate", 40000, 1),
    ("Head of Accounting", 100000, 2),
    ("CPA", 75000, 2),
    ("Head of Warehouse", 60000, 3),
    ("Warehouse Associate", 40000, 3),
    ("Lead Developer", 95000, 4),
    ("Developer", 65000, 4),
    ("CEO", 250000, 5),
    ("CFO", 200000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('James', 'Fraser', 1, NULL),
    ('Jack', 'London', 2, 1),
    ('Robert', 'Bruce', 5, NULL),
    ('Peter', 'Greenaway', 3, 3),
    ('Derek', 'Jarman', 3, 3),
    ('Paolo', 'Pasolini', 4, NULL),
    ('Heathcote', 'Williams', 3, 1);