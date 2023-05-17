const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const clientModel = require("./models/client.js"); // Assurez-vous que le chemin est correct

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/clients", function(req, res) {
  // Créer un nouveau client à partir des données de la requête
});

app.get("/clients", function(req, res) {
  // Renvoyer tous les clients
});

app.get("/clients/:id", function(req, res) {
  // Renvoyer un client spécifique
});

app.put("/clients/:id", function(req, res) {
  // Mettre à jour un client spécifique
});

app.delete("/clients/:id", function(req, res) {
  // Supprimer un client spécifique
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
