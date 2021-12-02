const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
});

module.exports = app;
