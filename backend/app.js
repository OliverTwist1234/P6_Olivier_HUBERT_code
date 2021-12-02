//Importation du package express, framework qui permet de développer des applications web et mobiles
const express = require("express");

//importation du package mangoose qui facilite les interactions avec notre base de données MongoDB
const mongoose = require("mongoose");

//importation du routeur d'authentification utilisateur
const userRoutes = require("./routes/user");

//on crée notre aplication express
const app = express();

//middleware global capable d'extraire l'objet JSON des requêtes POST provenants de l'application front-end
//va transformer le corps de la requête en objet JS utilisable
app.use(express.json());

//Importation package dotenv pour accéder aux variables d'environnement
require("dotenv").config();
//Connection de l'api au cluster MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

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

//on enregistre le routeur d'authentification utilisateur
app.use("/api/auth", userRoutes);

//on exporte notre application pour pouvoir s'en servir dans les autres fichiers
//notamment notre server node
module.exports = app;
