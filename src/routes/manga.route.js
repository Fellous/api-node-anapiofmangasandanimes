// ----------------------------------------------
// Importation du module router de express
// ----------------------------------------------
const router = require('express').Router();

// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le controller
// ----------------------------------------------
const {
    getAllMangas,
    getMangaById,
    getMangaByName,
    createManga,
    updateMangaById,
    deleteMangaById
} = require('../controllers/manga.controller');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
router.get('/', getAllMangas); // GET localhost:8081/api/v1/animes


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
router.get('/:id', getMangaById); // GET localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Récupérer un anime par son nom
// ----------------------------------------------
router.get('/filter/:nom', getMangaByName); // GET localhost:8081/api/v1/animes/filter/:nom


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
/**
{
    "refAuteur": "5",
    "nomOeuvre": "Test",
    "dateSortie": "Ajd",
    "description": "Description",
    "nbTomes": 10
}
 */
router.post('/', createManga); // POST localhost:8081/api/v1/animes


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
router.patch('/:id', updateMangaById); // PATCH localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
router.delete('/:id', deleteMangaById); // DELETE localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;