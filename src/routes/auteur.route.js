// ----------------------------------------------
// Importation du module router de express
// ----------------------------------------------
const router = require('express').Router();

// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le controller
// ----------------------------------------------
const {
    getAllAuteurs,
    getAuteurById,
    getAuteurByName,
    createAuteur,
    updateAuteurById,
    deleteAuteurById
} = require('../controllers/auteur.controller');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




// ----------------------------------------------
// Récupérer l'enssembles des auteurs
// ----------------------------------------------
router.get('/', getAllAuteurs); // GET localhost:8081/api/auteurs


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
router.get('/:id', getAuteurById); // GET localhost:8081/api/auteurs/:id


// ----------------------------------------------
// Récupérer un anime par son nom
// ----------------------------------------------
router.get('/filter/:nom', getAuteurByName); // GET localhost:8081/api/auteurs/filter/:nom


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
/**
{
    "nom": "nm",
    "prenom": "prn",
    "dateNaissance": "Ajd",
    "biographie": "desc",
    "listMaisonEditionMangas": [
        "2",
        "3",
        "9"
    ]
}
 */
router.post('/', createAuteur); // POST localhost:8081/api/v1/auteurs


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
router.patch('/:id', updateAuteurById); // PATCH localhost:8081/api/v1/auteurs/:id


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
router.delete('/:id', deleteAuteurById); // DELETE localhost:8081/api/v1/auteurs/:id


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;