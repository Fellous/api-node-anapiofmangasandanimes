// ----------------------------------------------
// Importation du module router de express
// ----------------------------------------------
const router = require('express').Router();

// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le controller
// ----------------------------------------------
const {
    getAllAnimes,
    getAnimeById,
    getAnimeByName,
    createAnime,
    updateAnimeById,
    deleteAnimeById
} = require('../controllers/anime.controller');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




// ----------------------------------------------
// Récupérer l'enssembles des animes
// ----------------------------------------------
/** Exemple d'écriture pour la documentation swagger du GET /animes
 * @swagger
 * /animes:
 *   get:
 *     summary: Permet de récupérer l'enssemble des animes présent dans la table
 *     tags:
 *      - Animes
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID dans la BDD.
 *                         example: 1
 *                       ref_auteur_id:
 *                         type: integer
 *                         description: Chemin de la ressource correspondante en BDD.
 *                         example: 1
 *                       titre:
 *                         type: string
 *                         description: Le nom de l'anime.
 *                         example: One Piece
 *                       nb_saisons:
 *                         type: integer
 *                         description: Nombre de saisons de l'anime.
 *                         example: 20
 *                       nb_episodes:
 *                         type: integer
 *                         description: Nombre d'épisodes de l'anime.
 *                         example: 1013
 *                       description:
 *                         type: string
 *                         description: Description de l'anime.
 *                         example: Description anime one piece
 */
router.get('/', getAllAnimes); // GET localhost:8081/api/v1/animes


// ----------------------------------------------
// Récupérer un anime par son ID
// ----------------------------------------------
/** Exemple d'écriture pour la documentation swagger du GET /animes/:id
 * @swagger
 * /animes/{id}:
 *   get:
 *     summary: Permet de récupérer l'anime en fonction de son id
 *     tags:
 *      - Animes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'anime recherché.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID dans la BDD.
 *                         example: 1
 *                       ref_auteur_id:
 *                         type: path
 *                         description: Chemin de la ressource correspondante en BDD.
 *                         example: 1
 *                       titre:
 *                         type: string
 *                         description: Le nom de l'anime.
 *                         example: One Piece
 *                       nb_saisons:
 *                         type: integer
 *                         description: Nombre de saisons de l'anime.
 *                         example: 20
 *                       nb_episodes:
 *                         type: integer
 *                         description: Nombre d'épisodes de l'anime.
 *                         example: 1013
 *                       description:
 *                         type: string
 *                         description: Description de l'anime.
 *                         example: Description anime one piece
 */
router.get('/:id', getAnimeById); // GET localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Récupérer un anime par son nom
// ----------------------------------------------
/** Exemple d'écriture pour la documentation swagger du GET /animes/filter/:nom
 * @swagger
 * /animes/filter/{nom}:
 *   get:
 *     summary: Permet de récupérer l'anime en fonction de son nom
 *     tags:
 *      - Animes
 *     parameters:
 *       - in: path
 *         name: nom
 *         required: true
 *         description: Nom de l'anime recherché.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID dans la BDD.
 *                         example: 1
 *                       ref_auteur_id:
 *                         type: path
 *                         description: Chemin de la ressource correspondante en BDD.
 *                         example: 1
 *                       titre:
 *                         type: string
 *                         description: Le nom de l'anime.
 *                         example: One Piece
 *                       nb_saisons:
 *                         type: integer
 *                         description: Nombre de saisons de l'anime.
 *                         example: 20
 *                       nb_episodes:
 *                         type: integer
 *                         description: Nombre d'épisodes de l'anime.
 *                         example: 1013
 *                       description:
 *                         type: string
 *                         description: Description de l'anime.
 *                         example: Description anime one piece
 */
router.get('/filter/:nom', getAnimeByName); // GET localhost:8081/api/v1/animes/filter/:nom


// ----------------------------------------------
// Créer un nouvel enregistrement en BDD
// ----------------------------------------------
/**
 {
 *      "titre": "Fate stay night Unlimited Blade Works",
 *      "nbSaisons": 2,
 *      "nbEpisodes": 25,
 *      "Description": "Shirô Emiya est le fils adoptif de Kiritsugu Emiya, un mage ayant déjà participé à la Guerre du Saint Graal. Cette guerre oppose 7 mages et 7 Servants, des âmes héroïques ramenés à la vie le temps des combats. 10 ans après son père, Shirô participera à une nouvelle guerre entre mages, accompagné du Servant de classe Saber.",
 *      "refAuteur": "4",
 *      "refStudioAnimation": [
 *          "1",
 *          "2"
 *      ]
 *  }
 */
router.post('/', createAnime); // POST localhost:8081/api/v1/animes


// ----------------------------------------------
// Mettre à jour un anime par son ID
// ----------------------------------------------
router.patch('/:id', updateAnimeById); // PATCH localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// Supprimer un anime par son ID
// ----------------------------------------------
router.delete('/:id', deleteAnimeById); // DELETE localhost:8081/api/v1/animes/:id


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;