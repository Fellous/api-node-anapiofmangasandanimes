// ----------------------------------------------
// Importantion du modèle pour la table anime
// ----------------------------------------------
const mangaModel = require('../models/manga.model');
const utils = require('../middleware/utils.middleware');


// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
getAllMangas = (request, response) => {
    mangaModel.getAllMangas((error, data) => {
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
getMangaById = (request, response) => {
    mangaModel.getMangaById(request.params.id, (error, data) => {
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
// Récupérer une maison par son nom
// ----------------------------------------------
getMangaByName = (request, response) => {
    mangaModel.getMangaByName(request.params.nom, (error, data) => {
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
createManga = (request, response) => {
    // le request.body permet de récupérer le contenue de la requette ( et de vérifier si le body est rempli)
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    // Sauvegarde du nouvel enregistrement dans le BDD
    mangaModel.createManga(new mangaModel.MangaConstructor(request.body), (error, dataMaison) => {
        if (error)
            response.status(500).send({
                message:
                    error.message || "Des erreurs sont apparues en créant le nouvel anime."
            });
        else {
            response.send(dataMaison);
        }
    });
};


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
updateMangaById = (request, response) => {
    if (!request.body) {
        response.status(400).send({
            message: "Le contenue ne peut être vide !"
        });
    }

    mangaModel.updateMangaById(request.params.id, new mangaModel.MangaConstructor(request.body), (error, dataMaison) => {
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
            response.send({ message: `L'enregistrement de la table anime à bien était mis à jour ainsi que dans la table Anime Studio Animation.` });
        }
    });
};


// ----------------------------------------------
// Supprimer une maison par son ID
// ----------------------------------------------
deleteMangaById = (request, response) => {
    mangaModel.deleteMangaById(request.params.id, (error, data) => {
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
            response.send({ message: `L'enregistrement de la table anime à bien était supprimé ainsi que dans la table Anime Studio Animation.` });
        }
    });
};


// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    getAllMangas,
    getMangaById,
    getMangaByName,
    createManga,
    updateMangaById,
    deleteMangaById
}