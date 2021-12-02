/******************************Routes pour les sauces*************************************/

//importation du package express
const express = require("express");

//On crée un routeur avec la méthode router d'express
const router = express.Router();

//importation du controlleur sauce.js pour l'associer aux différentes routes
const sauceCtrl = require("../controllers/sauce");

//importation du middleware d'authentification
const auth = require("../middleware/auth");

//importation du middelware de configuration de multer
const multer = require("../middleware/multer-config");

//Routes (CRUD) pour les sauces
//route pour récupérer toutes les sauces
router.get("/", auth, sauceCtrl.readAllSauces);
//route pour récupérer une sauce avec l'Id fourni
router.get("/:id", auth, sauceCtrl.readOneSauce);
//route pour créer une sauce
router.post("/", auth, multer, sauceCtrl.createSauce);
//route pour modifier une sauce avec l'Id fourni
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
//route pour supprimer une sauce avec l'Id fourni
router.delete("/:id", auth, sauceCtrl.deleteSauce);
//route pour liker ou disliker une sauce avec l'Id fourni
router.post("/:id/like", auth, sauceCtrl.likeDislike);

//Exportation du routeur
module.exports = router;
