/*********************************Configuration de multer**************************************/
//pour que les utilisateurs puissent télécharger des images de sauces

//importation du package multer qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");

//onstante dictionnaire de type MIME pour indiquer le type de fichiers supportés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//constante storage pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //a fonction filename indique à multer
  filename: (req, file, callback) => {
    //d'utiliser le nom d'origine, de remplacer les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    //d'utiliser la constante dictionnaire de type MIME pour ajouter l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    //d'ajouter un timestamp Date.now() comme nom de fichier
    callback(null, name + Date.now() + "." + extension);
  },
});

//Exportation du middleware multer
module.exports = multer({ storage: storage }).single("image");
