/***************************************Controllers des sauces**********************************************/

//importation du modèle Sauce
const Sauce = require("../models/Sauce");

//Importation fs package qui permet de modifier et/ou supprimer des fichiers
const fs = require("fs");

//controller de récupération de toutes les sauces
exports.readAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//controller de récupération d'une sauce
exports.readOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//controller de création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // un objet sauce est crée avec le model Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // l'url de l'image enregistrée dans le dossier images du serveur est stockée dans la base de données
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // la sauce est sauvegardée dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce ajoutée !" }))
    .catch((error) => res.status(400).json({ error }));
  console.log(sauce);
};

//controller de modification d'une sauce
exports.updateSauce = (req, res, next) => {
  if (req.file) {
    // si on modifie l'image de la sauce, alors on supprime l'ancienne image du fichier images
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        // si on utilise un id de sauce qui n'existe pas (sécurité)
        if (!sauce) {
          res.status(404).json({
            error: new Error("Sauce non trouvée !"),
          });
        }
        // et si le userId est différent de celui de l'utilisateur qui a créé la sauce (sécurité)
        if (sauce.userId !== req.auth.userId) {
          res.status(401).json({
            error: new Error("Requête non autorisée !"),
          });
        }
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // et on met à jour
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    // si l'image n'est pas modifiée, on met à jour les données modifiées.
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

//controller de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  // on identifie la sauce avec son Id
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // si on utilise un id de sauce qui n'existe pas (sécurité)
    if (!sauce) {
      res.status(404).json({
        error: new Error("Sauce non trouvée !"),
      });
    }
    // et si le userId est différent de celui de l'utilisateur qui a créé la sauce (sécurité)
    if (sauce.userId !== req.auth.userId) {
      res.status(401).json({
        error: new Error("Requête non autorisée !"),
      });
    }
    // on récupère l'adresse de l'image
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      /// on la supprime du serveur et de la base de données
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

//controller pour liker ou disliker une sauce
exports.likeDislike = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) {
    // si on like
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() => res.status(200).json({ message: "Vous aimez cette sauce !" }))

      .catch((error) => res.status(400).json({ error }));
  } else if (like === -1) {
    // si on dislike
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() =>
        res.status(200).json({ message: "Vous n'aimez pas cette sauce !" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    //si on annule le like ou le dislike
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({ message: "Vous avez annulé votre like !" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res
                .status(200)
                .json({ message: "Vous avez annulé votre dislike !" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
