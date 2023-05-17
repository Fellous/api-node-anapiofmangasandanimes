// ----------------------------------------------
// Importation du module router de express
// ----------------------------------------------
const router = require('express').Router();

// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le controller
// ----------------------------------------------
const {
    getAllMaisons,
    getMaisonById,
    getMaisonByName,
    createMaison,
    updateMaisonById,
    deleteMaisonById
} = require('../controllers/maison_edition.controller');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




// ----------------------------------------------
// Récupérer l'enssembles des maison_editions
// ----------------------------------------------
router.get('/', getAllMaisons); // GET localhost:8081/api/maison_editions


// ----------------------------------------------
// Récupérer une maison_editions par son ID
// ----------------------------------------------
router.get('/:id', getMaisonById); // GET localhost:8081/api/maison_editions/:id


// ----------------------------------------------
// Récupérer une maison_editions par son nom
// ----------------------------------------------
router.get('/filter/:nom', getMaisonByName); // GET localhost:8081/api/maison_editions/filter/:nom


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
/**
{
    "nom": "Test",
    "description": "La description",
    "dateCreation": "Ajd",
    "listAuteurs": [
        "1"
    ]
}
 */
router.post('/', createMaison); // POST localhost:8081/api/maison_editions


// ----------------------------------------------
// Mettre à jour une maison_editions par son ID
// ----------------------------------------------
router.patch('/:id', updateMaisonById); // PATCH localhost:8081/api/maison_editions/:id


// ----------------------------------------------
// Supprimer une maison_editions par son ID
// ----------------------------------------------
router.delete('/:id', deleteMaisonById); // DELETE localhost:8081/api/maison_editions/:id


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;