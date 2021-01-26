// import de modules
// import du framework backend 
const express = require("express");
// gestion des routes en relation avec user
const userRouter = express.Router();
// import du schema utilisateur 
const User = require("../models/user.js");
// import du module pour crypter le mot de passe
const bcrypt = require("bcrypt");
// indice pour la complexité du grain de sel 
const rounds = 10;
// module qui retourne le token 
const jwt = require("jsonwebtoken");
// signature pour décoder le token
const tokenSecret = "my-secret-token";
// vérification validité du token 
const middleware = require("./middleware.js");

// routes
// connexion
// fonction get liée à la route login 
userRouter.get("/login", (req, res) => {
  // recherche d'un utilisateur avec l'adresse email fournie par postman/browser
  User.findOne({ email: req.body.email }).then(user => {
    // s'il nexiste pas d'utilisateur avec cette adresse email, avertissement
    if (!user) res.status(404).json({ error: "No user with that email found" });
    else {
      // sinon, comparaison du mot de passe fourni pour connexion avec le mdp en bdd
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        // si erreur de comparaison => renvoi code d'erreur serveur interne
        if (error) res.status(500).json(error);
        // sinon si le statut de la réponse est à 200 (car réponse OK), génération d'un token avec les identifiants utilisateur contenus dans la requête
        else if (match) res.status(200).json({ token: generateToken(user) });
        // sinon si statut de réponse erreur 403, affichage message erreur en conséquence
        else res.status(403).json({ error: "The password is invalid" });
      });
    }
  });
});

// inscription
// TODO gestion d'erreur
userRouter.post("/signup", (req, res) => {
  // initialisation tableau vide pour stockage des entrées en bdd
  let users = [];
  // utilisation de la méthode find de mongodb pour parcourir la table user, sans paramètres de recherche (d'où les parenthèses vides)
  User.find({})
    .exec()
    .then(item => {
      // destructuring par spread operator pour ajout de chaque entrée de la table user dans le tableau users
      users = [...item];
      let isValid = true;
      const regex = new RegExp( // initialisation regex pour vérification format d'adresse email
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$"
      );
      // si la regex matche bien l'adresse email passée en requête
      if (regex.test(req.body.email)) {
        users.forEach(element => { // on itère sur la table users pour trouver un user qui utilise cet email 
          if (element.email == req.body.email) {  // si l'adresse email est trouvée en base, le nouvel utilisateur ne pourra pas l'utiliser
            // donc la nouvelle adresse email n'est pas considérée comme valide.
            isValid = false;
          }
        });
        // si isValid est à true, on va continuer en hashant le mot de passe via la fonction hash du module bcrypt
        if (isValid) { // Le nombre de rounds représente la complexité de salage, comme défini en début de fichier
          bcrypt.hash(req.body.password, rounds, (error, hash) => {
            if (error) { //
              res.status(500).json(error);
            } else {
              // si pas d'erreur de cryptage, écriture d'un nouvel user au format JSON pour matcher notre modèle User. email, et password crypté
              const newUser = User({
                email: req.body.email,
                password: hash,
              });
              // utilisation méthode save() d'ajout de user dans bdd
              newUser
                .save()
                .then(user => //si réponse en statut ok, génération de token utilisateur
                  res.status(200).json({ token: generateToken(user) })
                )
                .catch(error => res.status(500).json(error));
            }
          });
        } else { // sinon si isValid a été passé à false, adresse déjà utilisée
          res.send("email déja utilisé");
        }
      } else { // sinon si la regex ne matche pas, affichage message à l'utilisateur
        res.send("entrez une adresse email valide");
      }
    });
});

userRouter.get("/forgot", (req, res) => {
  res.send("un email a été envoyé sur sur votre messagerie pour validation");
});

userRouter.put("/update-user", (req, res) => {
  res.send("votre mot de passe a été changé");
  // TODO à creuser
});

// check & verify user
userRouter.get("/jwt-user", middleware.verify, (req, res) => {
  res.status(200).json(req.user);
});

// TODO gestion des erreurs

// export
module.exports = userRouter;

// functions

function generateToken(user) {
  return jwt.sign(
    {
      data: user,
    },
    tokenSecret,
    { expiresIn: "24h" }
  );
}
