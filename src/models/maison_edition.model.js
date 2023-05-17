// ----------------------------------------------
// Importation de la connexion à la bdd
// ----------------------------------------------
const dataBase = require('../db/db_connect');


// ----------------------------------------------
// Création d'un constructeur pour la création et la mise à jour des enregistrements
// ----------------------------------------------
const MaisonConstructor = function (maison) {
    this.nom = maison.nom;
    this.description = maison.description;
    this.dateCreation = maison.dateCreation;
    this.listAuteurs = maison.listAuteurs;
};

// ----------------------------------------------
// Récupérer l'enssembles des maison_editions
// ----------------------------------------------
getAllMaisons = result_bdd_request => {
    dataBase.query("SELECT id,nom,description,date_creation as dateCreation,auteur_id AS listAuteurs FROM maison_edition ME INNER JOIN maison_edition_auteur MA ON ME.id = MA.maison_edition_id where ME.id = MA.maison_edition_id ORDER BY ME.id", (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        // Le premier null représente les erreurs
        result_bdd_request(null, response);
    });
};


// ----------------------------------------------
// Récupérer une maison_editions par son ID
// ----------------------------------------------
getMaisonById = (selectedID, result_bdd_request) => {
    dataBase.query(`SELECT id,nom,description,date_creation as dateCreation,auteur_id AS listAuteurs FROM maison_edition ME INNER JOIN maison_edition_auteur MA ON ME.id = MA.maison_edition_id WHERE ME.id = ${selectedID} AND ME.id = MA.maison_edition_id ORDER BY ME.id`, (error, response) => {
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
// Récupérer une maison_editions par son nom
// ----------------------------------------------
getMaisonByName = (selectedName, result_bdd_request) => {
    dataBase.query(`SELECT id,nom,description,date_creation as dateCreation,auteur_id AS listAuteurs FROM maison_edition ME INNER JOIN maison_edition_auteur MA ON ME.id = MA.maison_edition_id WHERE ME.nom = '${selectedName}' AND ME.id = MA.maison_edition_id ORDER BY ME.id`, (error, response) => {
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
createMaison = (newMaison, result_bdd_request) => {
    dataBase.query(`INSERT INTO maison_edition SET nom = ?, description = ?, date_creation = ?`, [newMaison.nom, newMaison.description, newMaison.dateCreation],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null, { id: response.insertId, listAuteurs: newMaison.listAuteurs, ...newMaison });
        });
};
createMaisonInAuteur = (linkID, uniqueID, result_bdd_request) => {
    dataBase.query(`INSERT INTO maison_edition_auteur set auteur_id = ${linkID}, maison_edition_id = ${uniqueID}`,
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null);
        });
};


// ----------------------------------------------
// Mettre à jour une maison_editions par son ID
// ----------------------------------------------
updateMaisonById = (selectedID, selectedMaison, result_bdd_request) => {
    // COALESCE(NULLIF(?, ''), ref_auteur_id) Permet de concerver si jamais le body ne contient pas cette clès la valeur en BDD si jamais MySQL retourne un null(?) ou un empty string
    dataBase.query(
        "UPDATE maison_edition SET nom = COALESCE(NULLIF(?, ''), nom), description = COALESCE(NULLIF(?, ''), description), date_creation = COALESCE(NULLIF(?, ''), date_creation) WHERE id = ?",
        [selectedMaison.nom, selectedMaison.description, selectedMaison.dateCreation, selectedID],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "selected_maison_editions_not_found" });
                return;
            }
            result_bdd_request(null, { id: selectedID, listAuteurs: selectedMaison.listAuteurs, ...selectedMaison });
        }
    );
};


// ----------------------------------------------
// Supprimer une maison_editions par son ID
// ----------------------------------------------
deleteMaisonById = (selectedID, result_bdd_request) => {
    dataBase.query(`DELETE FROM maison_edition WHERE id = ${selectedID}`, (error, response) => {
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
delateMaisonInAuteur = (uniqueID, result_bdd_request) => {
    dataBase.query(`DELETE FROM maison_edition_auteur WHERE maison_edition_id = ${uniqueID}`,
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
    MaisonConstructor,
    getAllMaisons,
    getMaisonById,
    getMaisonByName,
    createMaison,
    createMaisonInAuteur,
    updateMaisonById,
    deleteMaisonById,
    delateMaisonInAuteur
};