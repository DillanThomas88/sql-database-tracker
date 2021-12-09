const inquirer = require("inquirer");
const { phrase } = require('./const');
const DB = require('./db');
const db = DB.db

class Prompt {

    mainInquirer = async () => {
        console.log(`\n\n`)
        const { initChoice } = await inquirer
            .prompt([
                {
                    type: 'list',
                    message: `Main Menu - select a table to View or Edit`,
                    name: 'initChoice',
                    choices: [
                        phrase.viewAllDepartments,
                        phrase.viewAllRoles,
                        phrase.viewAllEmployees,
                    ],
                },
            ])

        let choice = this.mainChoice(initChoice)
        let info = this.selectDataObject(choice)
        this.clearLog()
        this.sqlQuery(info)
        this.timer = setInterval(() => {
            this.tableInquirer(info)
            clearInterval(this.timer)
        }, 10);

    }

    tableInquirer = async (x) => {
        console.log(`\n\n`)
        const { choice } = await inquirer
            .prompt([
                {
                    type: 'list',
                    message: `What would you like to do?`,
                    name: 'choice',
                    choices: [
                        `Add ${x.id}`,
                        `Remove ${x.id}`,
                        `Update ${x.id}`,
                        `Drop Table`,
                        phrase.back,
                    ],
                },
            ])
        this.clearLog()

        this.sqlQuery(x)
        this.timer = setInterval(() => {
            if (x.id == 'department' && choice == `Add ${x.id}`) { this.addDepartment(x) }
            if (x.id == 'role' && choice == `Add ${x.id}`) { this.addRole(x) }
            if (x.id == 'employee' && choice == `Add ${x.id}`) { this.addEmployee(x) }
            if (choice == `Remove ${x.id}`) { this.remove(x) }
            if (choice == `Update ${x.id}`) { this.updateRow(x)}
            if (choice == `Drop ${x.id}`) { this.handleInfo('drop', x.id, x) }
            if (choice == phrase.back) { this.clearLog(); this.mainInquirer() }
            clearInterval(this.timer)
        }, 10);
    }
    clearLog() {
        console.clear()
        console.log(`\n\n`)
    }
    addDepartment = async (choice) => {
        let { department } = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: `Department name:`,
                    name: 'department',
                },
            ]);

        let sql = `INSERT INTO departments (department_name) VALUES ("${department}");`;
        db.query(sql, (err, res) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            this.clearLog();
            this.sqlQuery(choice);

            this.timer = setInterval(() => {
                this.tableInquirer(choice);
                clearInterval(this.timer);
            }, 10);
            return;
        });
    }

    mainChoice = (res) => {
        switch (res) {
            case phrase.viewAllDepartments:
                return 'department'
            case phrase.viewAllRoles:
                return 'role'
            case phrase.viewAllEmployees:
                return 'employee'

            default: break;
        }
    }
    selectDataObject(id) {
        const o = {}
        o.id = id
        o.select = `SELECT * FROM ${id}s`
        return o
    }
    sqlQuery(sql) {
        db.query(sql.select, (err, res) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            console.table(res);
        });
    }
    remove = async (choice) => {
        let { x } = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: `(delete)(press 'enter' to exit command) ${choice.id} id:`,
                    name: 'x',
                },
            ])
        let sql = `DELETE FROM ${choice.id}s WHERE id=${x}`
        this.handleInfo(x, sql, choice);
    }

    addRole = async (choice) => {
        let { title, salary, department } = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: `Title:`,
                    name: 'title',
                },
                {
                    type: 'input',
                    message: `Salary:`,
                    name: 'salary',
                },
                {
                    type: 'input',
                    message: `Department number:`,
                    name: 'department'
                },
            ])

        let sql = `INSERT INTO roles (title, salary, department) VALUES ("${title}", ${salary}, ${department});`
        db.query(sql, (err, res) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            this.clearLog();
            this.sqlQuery(choice);

            this.timer = setInterval(() => {
                this.tableInquirer(choice);
                clearInterval(this.timer);
            }, 10);
            return;
        });
    }
    addEmployee = async (choice) => {
        let { first, last, role, manager } = await inquirer
            .prompt([
                {
                    type: 'input',
                    message: `First name:`,
                    name: 'first',
                },
                {
                    type: 'input',
                    message: `Last name:`,
                    name: 'last',
                },
                {
                    type: 'input',
                    message: `Role number:`,
                    name: 'role'
                },
                {
                    type: 'input',
                    message: `Manager ID:`,
                    name: 'manager'
                },
            ])

        let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${first}","${last}",${role},${manager});`
        db.query(sql, (err, res) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            this.clearLog();
            this.sqlQuery(choice);

            this.timer = setInterval(() => {
                this.tableInquirer(choice);
                clearInterval(this.timer);
            }, 10);
            return;
        });
    }

    updateRow = async (choice) => {

        let { idnumber } = await inquirer
        
        .prompt([
            {
                type: 'input',
                message: `which department would you like to change? (id number):`,
                name: 'idnumber',
            },
        ]);

        let { department } = await inquirer
        
            .prompt([
                {
                    type: 'input',
                    message: `Asign new Department name:`,
                    name: 'department',
                },
            ]);

        let sql = `UPDATE ${choice.id}s SET department_name = '${department}' WHERE id = ${idnumber};`
        console.log(sql)
        db.query(sql, (err, res) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            this.clearLog();
            this.sqlQuery(choice);

            this.timer = setInterval(() => {
                this.tableInquirer(choice);
                clearInterval(this.timer);
            }, 10);
            return;
        });
    }


    handleInfo(x, sql, choice) {
        if (x != ``) {
            if (x == `drop`) {
                db.query(`DROP TABLE ${sql}s;`, (err, res) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    this.clearLog();

                    this.timer = setInterval(() => {
                        this.mainInquirer();
                        clearInterval(this.timer);
                    }, 10);
                    return;
                });
            } else {
                db.query(sql, (err, res) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    this.clearLog();
                    this.sqlQuery(choice);

                    this.timer = setInterval(() => {
                        this.tableInquirer(choice);
                        clearInterval(this.timer);
                    }, 10);
                    return;
                });

            }
        } else {
            this.clearLog();
            this.sqlQuery(choice);
            this.timer = setInterval(() => {
                this.tableInquirer(choice);
                clearInterval(this.timer);
            }, 10);
        }
    }
}


module.exports = {
    Prompt
}
