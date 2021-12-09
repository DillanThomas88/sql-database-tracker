const mysql = require('mysql2');
const express = require('express');
const prompt = require('./public/scripts/inquirer');
let Prompt = new prompt.Prompt
const app = express()

const PORT = process.env.PORT || 3001;
// const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'cms_db'
    },
    console.log(`Connected to the CMS database.`),
);

class Application {
    init() {
        console.clear()
        Prompt.mainInquirer()
    }
}

const App = new Application
App.init()

