// ----------------------------------------------
// Importantion du modèle pour la table auteur
// ----------------------------------------------
const auteurModel = require('../models/auteur.model');
const utils = require('../middleware/utils.middleware');


// ----------------------------------------------
// Récupérer l'enssembles des auteurs
// ----------------------------------------------
getAllAuteurs = (request, response) => {
    auteurModel.getAllAuteurs((error, data) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Une erreur est survenue en essayant de récupérer la table auteur."
            });
        else {
            data = utils.removeMultipleIdenticalObject(data);
            data = utils.specifyPath(data);
            response.send(data);
        }
    });
};


// ----------------------------------------------
// Récupérer un auteur par son ID
// ----------------------------------------------
getAuteurById = (request, response) => {
    auteurModel.getAuteurById(request.params.id, (error, data) => {
        if (error) {
            if (error.kind === "index_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table auteur n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: `L'id ${request.params.id} de la table auteur n'a pas était trouvé.`
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
// Récupérer un auteur par son nom
// ----------------------------------------------
getAuteurByName = (request, response) => {
    auteurModel.getAuteurByName(request.params.nom, (error, data) => {
        if (error) {
            if (error.kind === "name_not_found") {
                response.status(404).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles ! exemple : */filter/nom nom`
                });
            } else {
                response.status(500).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles ! exemple : */filter/nom nom`
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
createAuteur = (request, response) => {
    // le request.body permet de récupérer le contenue de la requette ( et de vérifier si le body est rempli)
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    // Sauvegarde du nouvel enregistrement dans le BDD
    auteurModel.createAuteur(new auteurModel.AuteurConstructor(request.body), (error, dataAuteur) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Des erreurs sont apparues en créant le nouvel auteur."
            });
        else {
            response.send(dataAuteur);
            if (dataAuteur.listMaisonEditionMangas !== undefined) {
                for (var i = 0; i < dataAuteur.listMaisonEditionMangas.length; i++) {
                    auteurModel.createAuteurInMaisonEdition(dataAuteur.listMaisonEditionMangas[i], dataAuteur.id, (error, dataEdition) => {
                        if (error)
                            response.status(500).send({
                                message:
                                    error.message || "Des erreurs sont apparues en créant l'enregistrement dans la table intermédiaire."
                            });
                        else response.send(dataEdition);
                    });
                }
            }
        }
    });
};


// ----------------------------------------------
// Mettre à jour un auteur par son ID
// ----------------------------------------------
updateAuteurById = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    auteurModel.updateAuteurById(request.params.id, new auteurModel.AuteurConstructor(request.body), (error, dataAnime) => {
        if (error) {
            if (error.kind === "selected_auteur_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table auteur n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: "Error lors de la mise à jour de la table pour l'id " + request.params.id
                });
            }
        } else {
            if (dataAnime.listMaisonEditionMangas != undefined) {
                auteurModel.deleteAuteurInMaisonEdition(request.params.id, (response, error, data) => {
                    if (error) {
                        if (error.kind === "index_not_found") {
                            response.status(404).send({
                                message: `L'id ${request.params.id} de la table intermédiaire n'a pas était trouvé`
                            });
                        } else {
                            response.status(500).send({
                                message: "Impossible de supprimer l'enregistrement de la table intermédiaire avec l'id " + request.params.id
                            });
                        }
                    }
                });
                for (var i = 0; i < dataAnime.listMaisonEditionMangas.length; i++) {
                    // L'ajout du response à cette endroit est pour permettre de re envoyer un header avec les données du create
                    auteurModel.createAuteurInMaisonEdition(dataAnime.listMaisonEditionMangas[i], request.params.id, (response, error, updateDataStudio) => {
                        if (error) {
                            response.status(500).send({
                                message:
                                    error.message || "Des erreurs sont apparues en mettant à jours l'enregistrement dans la table intermédiaire."
                            });
                        }
                    });
                }
                response.send({ message: `L'enregistrement de la table auteur à bien était mis à jour ainsi que dans la table intermédiaire.` });
            } else response.send({ message: `L'enregistrement de la table auteur à bien était mis à jour.` });
        }
    });
};


// ----------------------------------------------
// Supprimer un auteur par son ID - Pensser à supprimer d'aborder ses animes et mangas pour que ca marche
// ----------------------------------------------
deleteAuteurById = (request, response) => {
    auteurModel.deleteAuteurById(request.params.id, (error, data) => {
        if (error) {
            if (error.kind === "index_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table auteur n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: "Impossible de supprimer l'enregistrement de la table auteur avec l'id " + request.params.id
                });
            }
        } else {
            auteurModel.deleteAuteurInMaisonEdition(request.params.id, (error, data) => {
                if (error) {
                    if (error.kind === "index_not_found") {
                        response.status(404).send({
                            message: `L'enregistrement de la table auteur à bien était supprimé ainsi que dans la table intermédiaire.`
                        });
                    } else {
                        response.status(500).send({
                            message: "Impossible de supprimer l'enregistrement de la table intermédiaire avec l'id " + request.params.id
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
    getAllAuteurs,
    getAuteurById,
    getAuteurByName,
    createAuteur,
    updateAuteurById,
    deleteAuteurById
}