//Importation du package express, framework qui permet de développer des applications web et mobiles
const express = require("express");

//on crée notre aplication express
const app = express();

//Gestion des erreurs de CORS, pour permettre au serveurs front et back de communiquer
//Ajout d'un middleware qui permet d'ajouter des headers aux réponses de requêtes
app.use((req, res, next) => {
  //permet d'accéder à notre API depuis n'importe quelle origine ( '*' )
  res.setHeader("Access-Control-Allow-Origin", "*");
  // permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // permet d'envoyer des requêtes avec les méthodes ( GET ,POST , etc.)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//on exporte notre application pour pouvoir s'en servir dans les autres fichiers
//notamment notre server node
module.exports = app;
