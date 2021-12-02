//importation du package mangoose
const mongoose = require("mongoose");

//importation du package mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

//Création du schema utilisateur
const userSchema = mongoose.Schema({
  //mot clé unique pour s'assurer que 2 utilisateurs ne puissent pas utiliser la même adresse e-mail
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//On ajoute le validateur mongoose-unique-validator comme plugin au schema utilisateur
userSchema.plugin(uniqueValidator);

//Exportation du modèle utilisateur
module.exports = mongoose.model("User", userSchema);
