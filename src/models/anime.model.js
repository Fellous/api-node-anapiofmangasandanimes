// ----------------------------------------------
// Importation de la connexion à la bdd
// ----------------------------------------------
const dataBase = require('../db/db_connect');


// ----------------------------------------------
// Création d'un constructeur pour la création et la mise à jour des enregistrements
// ----------------------------------------------
const AnimeConstructor = function (anime) {
    this.refAuteur = anime.refAuteur;
    this.titre = anime.titre;
    this.nbSaisons = anime.nbSaisons;
    this.nbEpisodes = anime.nbEpisodes;
    this.Description = anime.Description;
    this.refStudioAnimation = anime.refStudioAnimation;
};

// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
getAllAnimes = result_bdd_request => {
    dataBase.query("SELECT id,ref_auteur_id as refAuteur,titre,nb_saisons as nbSaisons,nb_episodes as nbEpisodes,description as Description,studio_animation_id as refStudioAnimation FROM anime A LEFT OUTER JOIN studio_animation_anime S ON A.id = S.anime_id ORDER BY id", (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        // Le premier null représente les erreurs
        result_bdd_request(null, response);
    });
};


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
getAnimeById = (selectedID, result_bdd_request) => {
    dataBase.query(`SELECT id,ref_auteur_id as refAuteur,titre,nb_saisons as nbSaisons,nb_episodes as nbEpisodes,description as Description,studio_animation_id as refStudioAnimation FROM anime A LEFT OUTER JOIN studio_animation_anime S ON A.id = S.anime_id WHERE A.id = ${selectedID} ORDER BY id`, (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        if (response.length) {
            result_bdd_request(null, response);
            return; // Très important pour indiquer à node que l'on doit quitter la condition ! Dans une condition, node ne quitte pas de lui même sauf si c'est une erreur !!!
        }
        // Si jamais l'id renseigné n'existe pas je bind un nom qui sera utilisé dans le controller
        result_bdd_request({ kind: "index_not_found" });
    });
};


// ----------------------------------------------
// Récupérer un anime par son nom
// ----------------------------------------------
getAnimeByName = (selectedName, result_bdd_request) => {
    dataBase.query(`SELECT id,ref_auteur_id as refAuteur,titre,nb_saisons as nbSaisons,nb_episodes as nbEpisodes,description as Description,studio_animation_id as refStudioAnimation FROM anime A LEFT OUTER JOIN studio_animation_anime S ON A.id = S.anime_id WHERE titre = '${selectedName}' ORDER BY id`, (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        if (response.length) {
            result_bdd_request(null, response);
            return;
        }
        result_bdd_request({ kind: "name_not_found" });
    });
};


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
createAnime = (newAnime, result_bdd_request) => {
    dataBase.query(`INSERT INTO anime SET ref_auteur_id = ?, titre = ?, nb_saisons = ?, nb_episodes = ?, description = ?`, [newAnime.refAuteur, newAnime.titre, newAnime.nbSaisons, newAnime.nbEpisodes, newAnime.Description],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null, { id: response.insertId, refStudioAnimation: newAnime.refStudioAnimation, ...newAnime });
        });
};
createAnimeInStudioAnimation = (linkID, uniqueID, result_bdd_request) => {
    dataBase.query(`INSERT INTO studio_animation_anime set studio_animation_id = ${linkID}, anime_id = ${uniqueID}`,
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null);
        });
};


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
updateAnimeById = (selectedID, selectedAnime, result_bdd_request) => {
    // COALESCE(NULLIF(?, ''), ref_auteur_id) Permet de concerver si jamais le body ne contient pas cette clès la valeur en BDD si jamais MySQL retourne un null(?) ou un empty string
    dataBase.query(
        "UPDATE anime SET ref_auteur_id = COALESCE(NULLIF(?, ''), ref_auteur_id), titre = COALESCE(NULLIF(?, ''), titre), nb_saisons = COALESCE(NULLIF(?, ''), nb_saisons), nb_episodes = COALESCE(NULLIF(?, ''), nb_episodes), description = COALESCE(NULLIF(?, ''), description) WHERE id = ?",
        [selectedAnime.refAuteur, selectedAnime.titre, selectedAnime.nbSaisons, selectedAnime.nbEpisodes, selectedAnime.Description, selectedID],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "selected_anime_not_found" });
                return;
            }
            result_bdd_request(null, { id: selectedID, refStudioAnimation: selectedAnime.refStudioAnimation, ...selectedAnime });
        }
    );
};


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
deleteAnimeById = (selectedID, result_bdd_request) => {
    dataBase.query(`DELETE FROM anime WHERE id = ${selectedID}`, (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        if (response.affectedRows == 0) {
            result_bdd_request({ kind: "index_not_found" });
            return;
        }
        result_bdd_request(null, response);
    });
};
delateAnimeInStudioAnimation = (uniqueID, result_bdd_request) => {
    dataBase.query(`DELETE FROM studio_animation_anime WHERE anime_id = ${uniqueID}`,
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "index_not_found" });
                return;
            }
            result_bdd_request(null, response);;
        });
};

// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    AnimeConstructor,
    getAllAnimes,
    getAnimeById,
    getAnimeByName,
    createAnime,
    createAnimeInStudioAnimation,
    updateAnimeById,
    deleteAnimeById,
    delateAnimeInStudioAnimation
};