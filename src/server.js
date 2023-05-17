// Importation des modules nécessaires
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const db = require('./db_connect');


// Création de l'application Express
const app = express();

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

// Utilisation de JSON pour le corps des requêtes
app.use(express.json());

// Route pour obtenir tous les clients
app.get(process.env.CLIENTS_ROUTE, (req, res) => {
    let sql = 'SELECT * FROM clients';
    db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Route pour ajouter un nouveau client
app.post(process.env.CLIENTS_ROUTE, (req, res) => {
    let sql = 'INSERT INTO clients SET ?';
    let client = req.body;
    db.query(sql, client, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// Route pour modifier un client
app.put(process.env.CLIENTS_ROUTE + '/:id', (req, res) => {
    let sql = 'UPDATE clients SET ? WHERE id = ?';
    let data = [req.body, req.params.id];
    db.query(sql, data, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// Route pour supprimer un client
app.delete(process.env.CLIENTS_ROUTE + '/:id', (req, res) => {
    let sql = 'DELETE FROM clients WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

// Démarrage du serveur
app.listen(process.env.PORT, () => {
    console.log('Serveur démarré sur le port ' + process.env.PORT);
});
