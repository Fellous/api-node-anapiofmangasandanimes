const Client = require('../models/client.js');

// Créer et sauvegarder un nouveau client
exports.create = (req, res) => {
    // Vérifier que la requête est valide
    if(!req.body) {
        return res.status(400).send({
            message: "Client content can not be empty"
        });
    }

    // Créer un client
    const client = new Client({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });

    // Sauvegarder le client dans la base de données
    client.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the client."
        });
    });
};

// Récupérer et retourner tous les clients
exports.findAll = (req, res) => {
    Client.find()
    .then(clients => {
        res.send(clients);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving clients."
        });
    });
};

// Trouver un seul client avec l'id clientId
exports.findOne = (req, res) => {
    Client.findById(req.params.clientId)
    .then(client => {
        if(!client) {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
            });            
        }
        res.send(client);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving client with id " + req.params.clientId
        });
    });
};

// Mettre à jour un client identifié par l'id clientId
exports.update = (req, res) => {
    // Vérifier que la requête est valide
    if(!req.body) {
        return res.status(400).send({
            message: "Client content can not be empty"
        });
    }

    // Trouver le client et le mettre à jour avec le corps de la requête
    Client.findByIdAndUpdate(req.params.clientId, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }, {new: true})
    .then(client => {
        if(!client) {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
            });
        }
        res.send(client);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Error updating client with id " + req.params.clientId
        });
    });
};

// Supprimer un client avec l'id clientId
exports.delete = (req, res) => {
    Client.findByIdAndRemove(req.params.clientId)
    .then(client => {
        if(!client) {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
           });
        }
        res.send({message: "Client deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Client not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Could not delete client with id " + req.params.clientId
        });
    });
};
