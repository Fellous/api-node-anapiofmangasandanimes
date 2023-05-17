// ----------------------------------------------
// Importation du module router de express
// ----------------------------------------------
const router = require('express').Router();

// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le controller
// ----------------------------------------------
const {
    getAllStudios,
    getStudioById,
    getStudioByName,
    createStudio,
    updateStudioById,
    deleteStudioById
} = require('../controllers/studio.controller');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
router.get('/', getAllStudios); // GET localhost:8081/api/v1/animes


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
router.get('/:id', getStudioById); // GET localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Récupérer un anime par son nom
// ----------------------------------------------
router.get('/filter/:nom', getStudioByName); // GET localhost:8081/api/v1/animes/filter/:nom


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
/**
{
    "nom": "test",
    "description": "desc",
    "dateCreation": "ajd",
    "animeRealiser": [
      "7",
      "65",
      "66",
      "67",
      "69"
    ]
}
 */
router.post('/', createStudio); // POST localhost:8081/api/v1/animes


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
router.patch('/:id', updateStudioById); // PATCH localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
router.delete('/:id', deleteStudioById); // DELETE localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;