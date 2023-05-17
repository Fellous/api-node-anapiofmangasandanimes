// ----------------------------------------------
// Importation de la connexion à la bdd
// ----------------------------------------------
const dataBase = require('../db/db_connect');


// ----------------------------------------------
// Création d'un constructeur pour la création et la mise à jour des enregistrements
// ----------------------------------------------
const AuteurConstructor = function (auteur) {
    this.nom = auteur.nom;
    this.prenom = auteur.prenom;
    this.dateNaissance = auteur.dateNaissance;
    this.biographie = auteur.biographie;
    this.listMaisonEditionMangas = auteur.listMaisonEditionMangas;
};

// ----------------------------------------------
// Récupérer l'enssembles des auteurs
// ----------------------------------------------
getAllAuteurs = result_bdd_request => {
    dataBase.query("SELECT Au.id,Au.nom,Au.prenom,Au.date_naissance as dateNaissance,Au.biographie,Man.id AS refMangas,Mais.maison_edition_id AS listMaisonEditionMangas,Anim.id AS refAnimesAdaptation FROM auteur Au LEFT OUTER JOIN manga Man ON Au.id = Man.ref_auteur_id LEFT OUTER JOIN maison_edition_auteur Mais ON Au.id = Mais.auteur_id LEFT OUTER JOIN anime Anim ON Au.id = Anim.ref_auteur_id ORDER BY Au.id", (error, response) => {
        if (error) {
            result_bdd_request(error);
        }
        // Le premier null représente les erreurs
        result_bdd_request(null, response);
    });
};


// ----------------------------------------------
// Récupérer un auteur par son ID
// ----------------------------------------------
getAuteurById = (selectedID, result_bdd_request) => {
    dataBase.query(`SELECT Au.id,Au.nom,Au.prenom,Au.date_naissance as dateNaissance,Au.biographie,Man.id AS refMangas,Mais.maison_edition_id AS listMaisonEditionMangas,Anim.id AS refAnimesAdaptation FROM auteur Au LEFT OUTER JOIN manga Man ON Au.id = Man.id LEFT OUTER JOIN maison_edition_auteur Mais ON Au.id = Mais.auteur_id LEFT OUTER JOIN anime Anim ON Au.id = Anim.ref_auteur_id WHERE Au.id = ${selectedID} ORDER BY Au.id`, (error, response) => {
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
// Récupérer un auteur par son nom
// ----------------------------------------------
getAuteurByName = (selectedName, result_bdd_request) => {
    dataBase.query(`SELECT Au.id,Au.nom,Au.prenom,Au.date_naissance as dateNaissance,Au.biographie,Man.id AS refMangas,Mais.maison_edition_id AS listMaisonEditionMangas,Anim.id AS refAnimesAdaptation FROM auteur Au LEFT OUTER JOIN manga Man ON Au.id = Man.id LEFT OUTER JOIN maison_edition_auteur Mais ON Au.id = Mais.auteur_id LEFT OUTER JOIN anime Anim ON Au.id = Anim.ref_auteur_id WHERE Au.nom = '${selectedName}' ORDER BY Au.id`, (error, response) => {
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
createAuteur = (newAuteur, result_bdd_request) => {
    dataBase.query(`INSERT INTO auteur SET nom = ?, prenom = ?, date_naissance = ?, biographie = ?`, [newAuteur.nom, newAuteur.prenom, newAuteur.dateNaissance, newAuteur.biographie],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null, { id: response.insertId, listMaisonEditionMangas: newAuteur.listMaisonEditionMangas, ...newAuteur });
        });
};
createAuteurInMaisonEdition = (linkID, uniqueID, result_bdd_request) => {
    dataBase.query(`INSERT INTO maison_edition_auteur set maison_edition_id = ${linkID}, auteur_id = ${uniqueID}`,
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null);
        });
};


// ----------------------------------------------
// Mettre à jour un auteur par son ID
// ----------------------------------------------
updateAuteurById = (selectedID, selectedAuteur, result_bdd_request) => {
    dataBase.query(
        "UPDATE auteur SET nom = COALESCE(NULLIF(?, ''), nom), prenom = COALESCE(NULLIF(?, ''), prenom), date_naissance = COALESCE(NULLIF(?, ''), date_naissance), biographie = COALESCE(NULLIF(?, ''), biographie) WHERE id = ?",
        [selectedAuteur.nom, selectedAuteur.prenom, selectedAuteur.dateNaissance, selectedAuteur.biographie, selectedID],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "selected_auteur_not_found" });
                return;
            }
            result_bdd_request(null, { id: selectedID, listMaisonEditionMangas: selectedAuteur.listMaisonEditionMangas, ...selectedAuteur });
        }
    );
};


// ----------------------------------------------
// Supprimer un auteur par son ID
// ----------------------------------------------
deleteAuteurById = (selectedID, result_bdd_request) => {
    dataBase.query(`DELETE FROM auteur WHERE id = ${selectedID}`, (error, response) => {
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
deleteAuteurInMaisonEdition = (uniqueID, result_bdd_request) => {
    dataBase.query(`DELETE FROM maison_edition_auteur WHERE auteur_id = ${uniqueID}`,
        (error, response) => {
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



// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    AuteurConstructor,
    getAllAuteurs,
    getAuteurById,
    getAuteurByName,
    createAuteur,
    createAuteurInMaisonEdition,
    updateAuteurById,
    deleteAuteurById,
    deleteAuteurInMaisonEdition

};