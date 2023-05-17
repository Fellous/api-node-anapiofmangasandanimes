// ----------------------------------------------
// Importation des modules nécéssaires
// ----------------------------------------------
const dotenv = require('dotenv');
const express = require('express');


// ----------------------------------------------
// Importation des routes
// ----------------------------------------------
const animeRoute = require('./routes/anime.route');
const auteurRoute = require('./routes/auteur.route');
const maisonEditionRoute = require('./routes/maison_edition.route');
const mangaRoute = require('./routes/manga.route');
const studioRoute = require('./routes/studio.route');
const docRoute = require('./routes/swagger.route');


// ----------------------------------------------
// Initialisation et configuration
// ----------------------------------------------
dotenv.config(); // Initialisation des variables d'environnements

const server = express();
server.use(express.json()); // Spécifie que la réponse est au format json
server.set('json spaces', 2); // Permet de formatter la réponse pour réspécter l'indendation d'un json

// ----------------------------------------------
// Déclaration des endpoints
// ----------------------------------------------
server.use('/api/v1', docRoute);
server.use(process.env.ANIMES_ROUTE, animeRoute);
server.use(process.env.AUTEURS_ROUTE, auteurRoute);
server.use(process.env.MAISON_EDITIONS_ROUTE, maisonEditionRoute);
server.use(process.env.MANGAS_ROUTE, mangaRoute);
server.use(process.env.STUDIO_ANIMATIONS_ROUTE, studioRoute);


// ----------------------------------------------
// Lancement du server sur le port 8081
// ----------------------------------------------
const port = Number(process.env.PORT || 8081);
server.listen(port);

// ----------------------------------------------
// ----------------------------------------------
module.exports = server;