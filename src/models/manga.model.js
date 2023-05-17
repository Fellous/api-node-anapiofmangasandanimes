// ----------------------------------------------
// Importation de la connexion à la bdd
// ----------------------------------------------
const dataBase = require('../db/db_connect');


// ----------------------------------------------
// Création d'un constructeur pour la création et la mise à jour des enregistrements
// ----------------------------------------------
const MangaConstructor = function (manga) {
    this.refAuteur = manga.refAuteur;
    this.nomOeuvre = manga.nomOeuvre;
    this.dateSortie = manga.dateSortie;
    this.description = manga.description;
    this.nbTomes = manga.nbTomes;
};

// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
getAllMangas = result_bdd_request => {
    dataBase.query("SELECT id,ref_auteur_id as refAuteur,nom_oeuvre as nomOeuvre,date_sortie as dateSortie,description,nb_tomes as nbTomes FROM manga M ORDER BY M.id", (error, response) => {
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
getMangaById = (selectedID, result_bdd_request) => {
    dataBase.query(`SELECT id,ref_auteur_id as refAuteur,nom_oeuvre as nomOeuvre,date_sortie as dateSortie,description,nb_tomes as nbTomes FROM manga M WHERE M.id = ${selectedID} ORDER BY M.id`, (error, response) => {
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
// Récupérer une maison par son nom
// ----------------------------------------------
getMangaByName = (selectedName, result_bdd_request) => {
    dataBase.query(`SELECT id,ref_auteur_id as refAuteur,nom_oeuvre as nomOeuvre,date_sortie as dateSortie,description,nb_tomes as nbTomes FROM manga M WHERE M.nom_oeuvre = '${selectedName}' ORDER BY M.id`, (error, response) => {
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
createManga = (newManga, result_bdd_request) => {
    dataBase.query(`INSERT INTO manga SET ref_auteur_id = ?, nom_oeuvre = ?, date_sortie = ?, description = ?, nb_tomes = ?`, [newManga.refAuteur, newManga.nomOeuvre, newManga.dateSortie, newManga.description, newManga.nbTomes],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            result_bdd_request(null, { id: response.insertId, ...newManga });
        });
};


// ----------------------------------------------
// Mettre à jour une maison par son ID
// ----------------------------------------------
updateMangaById = (selectedID, selectedManga, result_bdd_request) => {
    // COALESCE(NULLIF(?, ''), ref_auteur_id) Permet de concerver si jamais le body ne contient pas cette clès la valeur en BDD si jamais MySQL retourne un null(?) ou un empty string
    dataBase.query(
        "UPDATE manga SET ref_auteur_id = COALESCE(NULLIF(?, ''), ref_auteur_id), nom_oeuvre = COALESCE(NULLIF(?, ''), nom_oeuvre), date_sortie = COALESCE(NULLIF(?, ''), date_sortie), description = COALESCE(NULLIF(?, ''), description), nb_tomes = COALESCE(NULLIF(?, ''), nb_tomes) WHERE id = ?",
        [selectedManga.refAuteur, selectedManga.nomOeuvre, selectedManga.dateSortie, selectedManga.description, selectedManga.nbTomes, selectedID],
        (error, response) => {
            if (error) {
                result_bdd_request(error);
            }
            if (response.affectedRows == 0) {
                result_bdd_request({ kind: "selected_anime_not_found" });
                return;
            }
            result_bdd_request(null, { id: selectedID, ...selectedManga });
        }
    );
};


// ----------------------------------------------
// Supprimer un manga par son ID
// ----------------------------------------------
deleteMangaById = (selectedID, result_bdd_request) => {
    dataBase.query(`DELETE FROM manga WHERE id = ${selectedID}`, (error, response) => {
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
    MangaConstructor,
    getAllMangas,
    getMangaById,
    getMangaByName,
    createManga,
    updateMangaById,
    deleteMangaById
};