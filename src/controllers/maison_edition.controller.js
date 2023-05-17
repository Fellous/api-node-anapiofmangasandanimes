// ----------------------------------------------
// Importantion du modèle pour la table maison_editions
// ----------------------------------------------
const maisonModel = require('../models/maison_edition.model');
const utils = require('../middleware/utils.middleware');


// ----------------------------------------------
// Récupérer l'enssembles des maison_editions
// ----------------------------------------------
getAllMaisons = (request, response) => {
    maisonModel.getAllMaisons((error, data) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Une erreur est survenue en essayant de récupérer la table maison_editions."
            });
        else {
            data = utils.removeMultipleIdenticalObject(data);
            data = utils.specifyPath(data);
            response.send(data);
        }
    });
};


// ----------------------------------------------
// Récupérer une maison_editions par son ID
// ----------------------------------------------
getMaisonById = (request, response) => {
    maisonModel.getMaisonById(request.params.id, (error, data) => {
        if (error) {
            if (error.kind === "index_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table maison_editions n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: `L'id ${request.params.id} de la table maison_editions n'a pas était trouvé.`
                });
            }
        } else {
            data = utils.removeMultipleIdenticalObject(data);
            data = utils.specifyPath(data);
            response.send(data);
        }
    });
};


// ----------------------------------------------
// Récupérer une maison_editions par son nom
// ----------------------------------------------
getMaisonByName = (request, response) => {
    maisonModel.getMaisonByName(request.params.nom, (error, data) => {
        if (error) {
            if (error.kind === "name_not_found") {
                response.status(404).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles  ! exemple : */filter/nom Nom`
                });
            } else {
                response.status(500).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles ! exemple : */filter/nom Nom`
                });
            }
        } else {
            data = utils.removeMultipleIdenticalObject(data);
            data = utils.specifyPath(data);
            response.send(data);
        }
    });
};


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
createMaison = (request, response) => {
    // le request.body permet de récupérer le contenue de la requette ( et de vérifier si le body est rempli)
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    // Sauvegarde du nouvel enregistrement dans le BDD
    maisonModel.createMaison(new maisonModel.MaisonConstructor(request.body), (error, dataMaison) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Des erreurs sont apparues en créant la nouvellle maison_editions."
            });
        else {
            response.send(dataMaison);
            for (var i = 0; i < dataMaison.listAuteurs.length; i++) {
                maisonModel.createMaisonInAuteur(dataMaison.listAuteurs[i], dataMaison.id, (error, dataStudio) => {
                    if (error)
                        response.status(500).send({
                            message:
                                error.message || "Des erreurs sont apparues en créant l'enregistrement dans la table intermédiaire."
                        });
                    else response.send(dataStudio);
                });
            }
        }
    });
};


// ----------------------------------------------
// Mettre à jour une maison_editions par son ID
// ----------------------------------------------
updateMaisonById = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    maisonModel.updateMaisonById(request.params.id, new maisonModel.MaisonConstructor(request.body), (error, dataMaison) => {
        if (error) {
            if (error.kind === "selected_maison_editions_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table maison_editions n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: "Error lors de la mise à jour de la maison_editions pour l'id " + request.params.id
                });
            }
        } else {
            if (dataMaison.listAuteurs != undefined) {
                maisonModel.delateMaisonInAuteur(request.params.id, (error, data) => {
                    if (error) {
                        if (error.kind === "index_not_found") {
                            response.status(404).send({
                                message: `L'enregistrement de la table maison_editions à bien était supprimé ainsi que dans la table intermédiaire.`
                            });
                        } else {
                            response.status(500).send({
                                message: "Impossible de supprimer l'enregistrement de la table intermédiaire avec l'id " + request.params.id
                            });
                        }
                    }
                });
                try {
                    for (var i = 0; i < dataMaison.listAuteurs.length; i++) {
                        // L'ajout du response à cette endroit est pour permettre de re envoyer un header avec les données du create
                        maisonModel.createMaisonInAuteur(dataMaison.listAuteurs[i], request.params.id, (response, error, updateDataStudio) => {
                            if (error) {
                                response.status(500).send({
                                    message:
                                        error.message || "Des erreurs sont apparues en mettant à jours l'enregistrement dans la table intermédiaire."
                                });
                            }
                        });
                    }
                } catch (e) {
                    return;
                }
                response.send({ message: `L'enregistrement de la table anime à bien était mis à jour ainsi que dans la table Anime Studio Animation.` });
            } else response.send({ message: `L'enregistrement de la table anime à bien était mis à jour.` });
        }
    });
};


// ----------------------------------------------
// Supprimer une maison_editions par son ID
// ----------------------------------------------
deleteMaisonById = (request, response) => {
    maisonModel.deleteMaisonById(request.params.id, (error, data) => {
        if (error) {
            if (error.kind === "index_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table anime n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: "Impossible de supprimer l'enregistrement de la table anime avec l'id " + request.params.id
                });
            }
        } else {
            maisonModel.delateMaisonInAuteur(request.params.id, (error, data) => {
                if (error) {
                    if (error.kind === "index_not_found") {
                        response.status(404).send({
                            message: `L'enregistrement de la table anime à bien était supprimé ainsi que dans la table Anime Studio Animation.`
                        });
                    } else {
                        response.status(500).send({
                            message: "Impossible de supprimer l'enregistrement de la table animeStudio avec l'id " + request.params.id
                        });
                    }
                }
            });
        }
    });
};


// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    getAllMaisons,
    getMaisonById,
    getMaisonByName,
    createMaison,
    updateMaisonById,
    deleteMaisonById
}