require('dotenv').config();
const express = require('express');
//const jwt = require('jsonwebtoken');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user : process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
});

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`
    Server is running.
    Port = ${port}
    API = http://localhost:${port}/api/
    `)
    });
