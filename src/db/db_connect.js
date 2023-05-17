// ----------------------------------------------
// Importation des modules nécéssaires
// ----------------------------------------------
const dotenv = require('dotenv');
const mysql = require('mysql');


// ----------------------------------------------
// Initialisation et configuration
// ----------------------------------------------
dotenv.config(); // Initialisation des variables d'environnements


// ----------------------------------------------
// Paramètres de connexion à la BDD
// ----------------------------------------------
const databaseConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});


// ----------------------------------------------
// ----------------------------------------------
module.exports = databaseConnection;