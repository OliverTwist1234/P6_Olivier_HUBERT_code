/*******************************Middleware d'authentification*********************************/

//Importation du package jsonwebtoken pour vérifier les tokens
const jwt = require("jsonwebtoken");

//Eportation du middleware d'authentification
module.exports = (req, res, next) => {
  //étant donné que de nombreux problèmes peuvent se produire
  //on insère tout à l'intérieur d'un bloc try...catch
  try {
    //on extraie le token du header Authorization de la requête entrante.
    //il contiendra le mot-clé Bearer
    //on utilise donc la fonction split pour récupérer tout après l'espace dans le header
    //Les erreurs générées ici s'afficheront dans le bloc catch
    const token = req.headers.authorization.split(" ")[1];
    //On utilise ensuite la fonction verify pour décoder le token
    //Si celui-ci n'est pas valide, une erreur sera générée
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //on extraie l'ID utilisateur du token
    const userId = decodedToken.userId;
    //on attribue le userId à l'objet requête
    req.auth = { userId };
    //si la requête contient un ID utilisateur, on le compare à celui extrait du token
    //S'ils sont différents, on génère une erreur
    if (req.body.userId && req.body.userId !== userId) {
      throw "userId non valable !";
    } else {
      //sinon tout fonctionne et notre utilisateur est authentifié
      //on passe l'exécution à l'aide de la fonction next() au middelware suivant
      next();
    }
  } catch {
    // si on reçoit une erreur, on renvoie le code 401 Unauthorized et un message d'erreur
    res.status(401).json({
      error: new Error("Requête non authentifiée!"),
    });
  }
};
