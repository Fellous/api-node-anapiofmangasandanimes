require('dotenv').config();
const mysql = require('mysql');

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à la base de données');
});

module.exports = db;
