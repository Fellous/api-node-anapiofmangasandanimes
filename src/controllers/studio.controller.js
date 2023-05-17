// ----------------------------------------------
// Importantion du modèle pour la table anime
// ----------------------------------------------
const studioModel = require('../models/studio.model');
const utils = require('../middleware/utils.middleware');


// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
getAllStudios = (request, response) => {
    studioModel.getAllStudios((error, data) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Une erreur est survenue en essayant de récupérer la table anime."
            });
        else {
            data = utils.removeMultipleIdenticalObject(data);
            data = utils.specifyPath(data);
            response.send(data);
        }
    });
};


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
getStudioById = (request, response) => {
    studioModel.getStudioById(request.params.id, (error, data) => {
        if (error) {
            if (error.kind === "index_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table anime n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: `L'id ${request.params.id} de la table anime n'a pas était trouvé.`
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
// Récupérer un Studio par son nom
// ----------------------------------------------
getStudioByName = (request, response) => {
    studioModel.getStudioByName(request.params.nom, (error, data) => {
        if (error) {
            if (error.kind === "name_not_found") {
                response.status(404).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles et une majuscule à chaque mot est nécéssaire ! exemple : */filter/One Piece`
                });
            } else {
                response.status(500).send({
                    message: `${request.params.nom} n'a pas était trouvé. Les espaces sont possibles et une majuscule à chaque mot est nécéssaire ! exemple : */filter/One Piece`
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
createStudio = (request, response) => {
    // le request.body permet de récupérer le contenue de la requette ( et de vérifier si le body est rempli)
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    // Sauvegarde du nouvel enregistrement dans le BDD
    studioModel.createStudio(new studioModel.StudioConstructor(request.body), (error, dataStudio) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Des erreurs sont apparues en créant le nouvel anime."
            });
        else {
            response.send(dataStudio);
            for (var i = 0; i < dataStudio.animeRealiser.length; i++) {
                studioModel.createStudioInAnime(dataStudio.animeRealiser[i], dataStudio.id, (error, dataAnime) => {
                    if (error)
                        response.status(500).send({
                            message:
                                error.message || "Des erreurs sont apparues en créant l'enregistrement dans la table intermédiaire."
                        });
                    else response.send(dataAnime);
                });
            }
        }
    });
};


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
updateStudioById = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    studioModel.updateStudioById(request.params.id, new studioModel.StudioConstructor(request.body), (error, dataStudio) => {
        if (error) {
            if (error.kind === "selected_anime_not_found") {
                response.status(404).send({
                    message: `L'id ${request.params.id} de la table anime n'a pas était trouvé.`
                });
            } else {
                response.status(500).send({
                    message: "Error lors de la mise à jour de la table pour l'id " + request.params.id
                });
            }
        } else {
            if (dataStudio.animeRealiser != undefined) {
                studioModel.delateStudioInAnime(request.params.id, (error, data) => {
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
                try {
                    for (var i = 0; i < dataStudio.animeRealiser.length; i++) {
                        // L'ajout du response à cette endroit est pour permettre de re envoyer un header avec les données du create
                        studioModel.createStudioInAnime(dataStudio.animeRealiser[i], request.params.id, (response, error, updateDataAnime) => {
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
// Supprimer un anime par son ID
// ----------------------------------------------
deleteStudioById = (request, response) => {
    studioModel.deleteStudioById(request.params.id, (error, data) => {
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
            studioModel.delateStudioInAnime(request.params.id, (error, data) => {
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
    getAllStudios,
    getStudioById,
    getStudioByName,
    createStudio,
    updateStudioById,
    deleteStudioById
}