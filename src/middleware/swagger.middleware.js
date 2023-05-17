// ----------------------------------------------
// Importation de la lib pour générer le json swagger
// ----------------------------------------------
const swaggerJsDoc = require('swagger-jsdoc');


// ----------------------------------------------
// Définition de l'architecture de base de la documentation 
// ----------------------------------------------
const swaggerGeneration = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'anApiOfMangasAndAnimes',
            version: '0.1.0'
        },
        servers: [
            {
                url: "http://localhost:8081/api/v1",
            },
        ],
    },
    apis: ['src/routes/*.js'] // Je récupère l'enssemble des commentaires swagger venant des fichiers .js du dossier routes
};

const swaggerOptions = swaggerJsDoc(swaggerGeneration);




// ----------------------------------------------
// Permet de trier dans la documentation par type de requette HTTP
// ----------------------------------------------
const swaggerSortByHTTPRequest = {
    swaggerOptions: {
        operationsSorter: (httpRequest_first_index, httpRequest_second_index) => {
            var methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
            var result = methodsOrder.indexOf(httpRequest_first_index.get("method")) - methodsOrder.indexOf(httpRequest_second_index.get("method"));

            if (result === 0) {
                result = httpRequest_first_index.get("path").localeCompare(httpRequest_second_index.get("path"));
            }
            return result;
        }
    }
};



// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    swaggerOptions,
    swaggerSortByHTTPRequest
}