const dotenv = require('dotenv');
dotenv.config();


// ----------------------------------------------
// Permet d'assurer l'auto découvrabilité pour tout le projet
// ----------------------------------------------
function removeMultipleIdenticalObject(ObjectData) {
    for (var i = 0; i < ObjectData.length; i++) {
        // Je récupère l'essemble des clès de l'object à l'id de l'occurance
        var uniqueObject = Object.keys(ObjectData[i]);
        // Je vérifie si l'id actuel est le même que l'antérieur
        if (i >= 1 && ObjectData[i].id == ObjectData[i - 1].id) {
            for (var t = 0; t < uniqueObject.length; t++) {
                switch (uniqueObject[t]) {
                    case 'refStudioAnimation':
                        ObjectData[i].refStudioAnimation = [ObjectData[i - 1].refStudioAnimation, ObjectData[i].refStudioAnimation];
                        ObjectData[i].refStudioAnimation = verifyArrayInRow(ObjectData[i].refStudioAnimation);
                        // Je supprime la première apparition de la ressource pour chaque doublon 
                        delete ObjectData[i - 1];
                        ObjectData.splice(i - 1, 1);
                        // Afin de recalculer la taille du nouveau fichier JSON je re appel la function 
                        removeMultipleIdenticalObject(ObjectData);
                        break;
                    case 'listMaisonEditionMangas':
                        ObjectData[i].listMaisonEditionMangas = [ObjectData[i - 1].listMaisonEditionMangas, ObjectData[i].listMaisonEditionMangas];
                        ObjectData[i].listMaisonEditionMangas = verifyArrayInRow(ObjectData[i].listMaisonEditionMangas);
                        // Je supprime la première apparition de la ressource pour chaque doublon 
                        delete ObjectData[i - 1];
                        ObjectData.splice(i - 1, 1);
                        // Afin de recalculer la taille du nouveau fichier JSON je re appel la function 
                        removeMultipleIdenticalObject(ObjectData);
                        break;
                    case 'listAuteurs':
                        ObjectData[i].listAuteurs = [ObjectData[i - 1].listAuteurs, ObjectData[i].listAuteurs];
                        ObjectData[i].listAuteurs = verifyArrayInRow(ObjectData[i].listAuteurs);
                        // Je supprime la première apparition de la ressource pour chaque doublon 
                        delete ObjectData[i - 1];
                        ObjectData.splice(i - 1, 1);
                        // Afin de recalculer la taille du nouveau fichier JSON je re appel la function 
                        removeMultipleIdenticalObject(ObjectData);
                        break;
                    case 'animeRealiser':
                        ObjectData[i].animeRealiser = [ObjectData[i - 1].animeRealiser, ObjectData[i].animeRealiser];
                        ObjectData[i].animeRealiser = verifyArrayInRow(ObjectData[i].animeRealiser);
                        // Je supprime la première apparition de la ressource pour chaque doublon 
                        delete ObjectData[i - 1];
                        ObjectData.splice(i - 1, 1);
                        // Afin de recalculer la taille du nouveau fichier JSON je re appel la function 
                        removeMultipleIdenticalObject(ObjectData);
                    default:
                        break;
                }
            }
        }
    }
    return ObjectData;
};
// Je vérifie si le tableau n'a pas de tableau dans un de ses champs si oui je reconstruit le tableau
function verifyArrayInRow(DataTable) {
    var newDataTable = [];
    for (var i = 0; i < DataTable.length; i++) {
        if (DataTable[i].length != undefined) {
            for (var x = 0; x < DataTable[i].length; x++) {
                newDataTable.push(DataTable[i][x]);
            }
        } else newDataTable.push(DataTable[i]);
    }
    return newDataTable;
};


// ----------------------------------------------
// Permet d'assurer l'auto découvrabilité pour tout le projet
// ----------------------------------------------
function specifyPath(ObjectData) {
    for (var i = 0; i < ObjectData.length; i++) {
        var uniqueObject = Object.keys(ObjectData[i]);
        for (var t = 0; t < uniqueObject.length; t++) {
            switch (uniqueObject[t]) {
                case 'refAuteur':
                    if (ObjectData[i].refAuteur !== null) {
                        ObjectData[i].refAuteur = process.env.AUTEURS_ROUTE + "/" + ObjectData[i].refAuteur;
                    } else ObjectData[i].refAuteur = "";
                    break;
                case 'refStudioAnimation':
                    if (ObjectData[i].refStudioAnimation !== null) {
                        if (ObjectData[i].refStudioAnimation.length != undefined) {
                            for (var x = 0; x < ObjectData[i].refStudioAnimation.length; x++) {
                                ObjectData[i].refStudioAnimation[x] = process.env.STUDIO_ANIMATIONS_ROUTE + "/" + ObjectData[i].refStudioAnimation[x];
                            }
                        } else ObjectData[i].refStudioAnimation = process.env.STUDIO_ANIMATIONS_ROUTE + "/" + ObjectData[i].refStudioAnimation;
                    } else {
                        ObjectData[i].refStudioAnimation = [];
                    }
                    break;
                case 'refMangas':
                    if (ObjectData[i].refMangas !== null) {
                        if (ObjectData[i].refMangas.length != undefined) {
                            for (var x = 0; x < ObjectData[i].refMangas.length; x++) {
                                ObjectData[i].refMangas[x] = process.env.MANGAS_ROUTE + "/" + ObjectData[i].refMangas[x];
                            }
                        } else ObjectData[i].refMangas = process.env.MANGAS_ROUTE + "/" + ObjectData[i].refMangas;
                    } else {
                        ObjectData[i].refMangas = [];
                    }
                    break;
                case 'listMaisonEditionMangas':
                    if (ObjectData[i].listMaisonEditionMangas !== null) {
                        if (ObjectData[i].listMaisonEditionMangas.length != undefined) {
                            for (var x = 0; x < ObjectData[i].listMaisonEditionMangas.length; x++) {
                                ObjectData[i].listMaisonEditionMangas[x] = process.env.MAISON_EDITIONS_ROUTE + "/" + ObjectData[i].listMaisonEditionMangas[x];
                            }
                        } else ObjectData[i].listMaisonEditionMangas = process.env.MAISON_EDITIONS_ROUTE + "/" + ObjectData[i].listMaisonEditionMangas;
                    } else {
                        ObjectData[i].listMaisonEditionMangas = [];
                    }
                    break;
                case 'refAnimesAdaptation':
                    if (ObjectData[i].refAnimesAdaptation !== null) {
                        if (ObjectData[i].refAnimesAdaptation.length != undefined) {
                            for (var x = 0; x < ObjectData[i].refAnimesAdaptation.length; x++) {
                                ObjectData[i].refAnimesAdaptation[x] = process.env.ANIMES_ROUTE + "/" + ObjectData[i].refAnimesAdaptation[x];
                            }
                        } else ObjectData[i].refAnimesAdaptation = process.env.ANIMES_ROUTE + "/" + ObjectData[i].refAnimesAdaptation;
                    } else {
                        ObjectData[i].refAnimesAdaptation = [];
                    }
                    break;
                case 'listAuteurs':
                    if (ObjectData[i].listAuteurs !== null) {
                        if (ObjectData[i].listAuteurs.length != undefined) {
                            for (var x = 0; x < ObjectData[i].listAuteurs.length; x++) {
                                ObjectData[i].listAuteurs[x] = process.env.AUTEURS_ROUTE + "/" + ObjectData[i].listAuteurs[x];
                            }
                        } else ObjectData[i].listAuteurs = process.env.AUTEURS_ROUTE + "/" + ObjectData[i].listAuteurs;
                    } else {
                        ObjectData[i].listAuteurs = [];
                    }
                    break;
                case 'animeRealiser':
                    if (ObjectData[i].animeRealiser !== null) {
                        if (ObjectData[i].animeRealiser.length != undefined) {
                            for (var x = 0; x < ObjectData[i].animeRealiser.length; x++) {
                                ObjectData[i].animeRealiser[x] = process.env.ANIMES_ROUTE + "/" + ObjectData[i].animeRealiser[x];
                            }
                        } else ObjectData[i].animeRealiser = process.env.ANIMES_ROUTE + "/" + ObjectData[i].animeRealiser;
                    } else {
                        ObjectData[i].animeRealiser = [];
                    }

                    break;
                default:
                    break;
            }
        }
    }
    return ObjectData;
};


// ----------------------------------------------
// ----------------------------------------------
module.exports = {
    removeMultipleIdenticalObject,
    specifyPath
};