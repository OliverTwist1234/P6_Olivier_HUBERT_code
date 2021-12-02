/***********************ROUTES d'authentifications utilisateur***********************/

//importation du package express
const express = require("express");

//On crée un routeur avec la méthode router d'express
const router = express.Router();

//importation du controlleur d'authentification utilisateur pour l'associer aux différentes routes
const userCtrl = require("../controllers/user");

//création des routes post d'authentification utilisateur
//pour s'enregistrer
router.post("/signup", userCtrl.signup);
//et pour s'identifier sur le site
router.post("/login", userCtrl.login);

//Exportation du routeur
module.exports = router;
