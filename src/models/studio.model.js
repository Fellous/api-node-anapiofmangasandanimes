// ----------------------------------------------
// Importation de la connexion à la bdd
// ----------------------------------------------
const dataBase = require('../db/db_connect');


// ----------------------------------------------
// Création d'un constructeur pour la création et la mise à jour des enregistrements
// ----------------------------------------------
const StudioConstructor = function (studio) {
    this.nom = studio.nom;
    this.description = studio.description;
    this.dateCreation = studio.dateCreation;
    this.animeRealiser = studio.animeRealiser;
};

// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
getAllStudios = result_bdd_request => {
    dataBase.query("SELECT id,nom,description,date_creation as dateCreation,anime_id AS animeRealiser FROM studio_animation SA INNER JOIN studio_animation_anime S ON SA.id = S.studio_animation_id where SA.id = S.studio_animation_id ORDER BY id", (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        // Le premier null représente les erreurs
        result_bdd_request(null, response);
    });
};


// ----------------------------------------------
// Récupérer un studio par son ID
// ----------------------------------------------
getStudioById = (selectedID, result_bdd_request) => {
    dataBase.query(`SELECT id,nom,description,date_creation as dateCreation,anime_id AS animeRealiser FROM studio_animation SA INNER JOIN studio_animation_anime S ON SA.id = S.studio_animation_id WHERE SA.id = ${selectedID} AND SA.id = S.studio_animation_id ORDER BY id`, (error, response) => {
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
getStudioByName = (selectedName, result_bdd_request) => {
    dataBase.query(`SELECT id,nom,description,date_creation as dateCreation,anime_id AS animeRealiser FROM studio_animation SA INNER JOIN studio_animation_anime S ON SA.id = S.studio_animation_id WHERE SA.nom = '${selectedName}' AND SA.id = S.studio_animation_id ORDER BY id`, (error, response) => {
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
createStudio = (newStudio, result_bdd_request) => {
    dataBase.query(`INSERT INTO studio_animation SET nom = ?, description = ?, date_creation = ?`, [newStudio.nom, newStudio.description, newStudio.dateCreation],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null, { id: response.insertId, animeRealiser: newStudio.animeRealiser, ...newStudio });
        });
};
createStudioInAnime = (linkID, uniqueID, result_bdd_request) => {
    dataBase.query(`INSERT INTO studio_animation_anime set anime_id = ${linkID}, studio_animation_id = ${uniqueID}`,
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
updateStudioById = (selectedID, selectedStudio, result_bdd_request) => {
    // COALESCE(NULLIF(?, ''), ref_auteur_id) Permet de concerver si jamais le body ne contient pas cette clès la valeur en BDD si jamais MySQL retourne un null(?) ou un empty string
    dataBase.query(
        "UPDATE studio_animation SET nom = COALESCE(NULLIF(?, ''), nom), description = COALESCE(NULLIF(?, ''), description), date_creation = COALESCE(NULLIF(?, ''), date_creation) WHERE id = ?",
        [selectedStudio.nom, selectedStudio.description, selectedStudio.dateCreation, selectedID],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "selected_anime_not_found" });
                return;
            }
            result_bdd_request(null, { id: selectedID, animeRealiser: selectedStudio.animeRealiser, ...selectedStudio });
        }
    );
};


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
deleteStudioById = (selectedID, result_bdd_request) => {
    dataBase.query(`DELETE FROM studio_animation WHERE id = ${selectedID}`, (error, response) => {
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
delateStudioInAnime = (uniqueID, result_bdd_request) => {
    dataBase.query(`DELETE FROM studio_animation_anime WHERE studio_animation_id = ${uniqueID}`,
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
    StudioConstructor,
    getAllStudios,
    getStudioById,
    getStudioByName,
    createStudio,
    createStudioInAnime,
    updateStudioById,
    deleteStudioById,
    delateStudioInAnime
};