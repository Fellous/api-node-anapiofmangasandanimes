// ----------------------------------------------
// Importation des modules
// ----------------------------------------------
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');


// ----------------------------------------------
// Définition de l'enssembles des constantes utilisant le middleware
// ----------------------------------------------
const getConfigSwagger = require('../middleware/swagger.middleware');




// ----------------------------------------------
// ----------------------------------------------
// ------------ Définition des routes -----------
// ----------------------------------------------
// ----------------------------------------------




router.use('/doc', swaggerUi.serve);
router.get('/doc', swaggerUi.setup(getConfigSwagger.swaggerOptions, getConfigSwagger.swaggerSortByHTTPRequest));


// ----------------------------------------------
// ----------------------------------------------
module.exports = router;
