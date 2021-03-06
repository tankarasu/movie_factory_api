// import de modules
// import du framework backend
const express = require("express");
const userRouter = express.Router(); // gestion des routes en relation avec user
const User = require("../models/user.js"); // import du schema utilisateur
const bcrypt = require("bcrypt"); // import du module pour crypter le mot de passe
const rounds = 10; // indice pour la complexité du grain de sel
const jwt = require("jsonwebtoken"); // module qui retourne le token
const tokenSecret = "my-secret-token"; // signature pour décoder le token
const middleware = require("./middleware.js"); // inclusion middleware contenant méthode check validité du token

// routes
// connexion
// fonction get liée à la route login
userRouter.post("/login", (req, res) => {
  // recherche d'un utilisateur avec l'adresse email fournie par postman/browser
  User.findOne({ email: req.body.email }).then(user => {
    // s'il n'existe pas d'utilisateur avec cette adresse email, avertissement
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

/**
 * All user to fetch
 */
userRouter.get("/alluser", (req, res) => {
  User.find({})
    .then(result => {
      console.log("result:", result);
      res.send(result);
    })
    .catch(err => err);
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
        users.forEach(element => {
          // on itère sur la table users pour trouver un user qui utilise cet email
          if (element.email == req.body.email) {
            // si l'adresse email est trouvée en base, le nouvel utilisateur ne pourra pas l'utiliser
            // donc la nouvelle adresse email n'est pas considérée comme valide.
            isValid = false;
          }
        });
        // si isValid est à true, on va continuer en hashant le mot de passe via la fonction hash du module bcrypt
        if (isValid) {
          // Le nombre de rounds représente la complexité de salage, comme défini en début de fichier
          bcrypt.hash(req.body.password, rounds, (error, hash) => {
            if (error) {
              //
              res.status(500).json(error);
            } else {
              // si pas d'erreur de cryptage, écriture d'un nouvel user au format JSON pour matcher notre modèle User. email, et password crypté
              const newUser = User({
                email: req.body.email,
                password: hash,
                username: req.body.username,
                favorite: [],
                seen: [],
              });
              // utilisation méthode save() d'ajout de user dans bdd
              newUser
                .save()
                .then((
                  user //si réponse en statut ok, génération de token utilisateur
                ) => res.status(200).json({ token: generateToken(user) }))
                .catch(error => res.status(500).json(error));
            }
          });
        } else {
          // sinon si isValid a été passé à false, adresse déjà utilisée
          res.send("Email déja utilisé");
        }
      } else {
        // sinon si la regex ne matche pas, affichage message à l'utilisateur
        res.send("Entrez une adresse email valide");
      }
    });
});

userRouter.post("/forgot", (req, res) => {
  let users = [];
  User.find({})
  .exec()
  .then(item => {
    let users = [];
    // utilisation de la méthode find de mongodb pour parcourir la table user, sans paramètres de recherche (d'où les parenthèses vides)
    User.find({})
      .exec()
      .then(item => {
        // destructuring par spread operator pour ajout de chaque entrée de la table user dans le tableau users
        users = [...item];
        let found = false;
        const regex = new RegExp( // initialisation regex pour vérification format d'adresse email
          "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$"
        );
        // si la regex matche bien l'adresse email passée en requête
        if (regex.test(req.body.recipientEmail)) {
          users.forEach(element => {
            // on itère sur la table users pour trouver un user qui utilise cet email
            if (element.email == req.body.recipientEmail) {
              // si l'adresse email est trouvée en base, on va pouvoir déclencher l'envoi de mail
              found = true;
            }
          });
          if (found) {
            // partie envoi de mail
            const nodemailer = require('nodemailer');
            const {smtpEmail,smtpPassword,oAuthID,oAuthSecret,refreshToken } = process.env;
            // création d'un objet transporter
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user: smtpEmail,
                pass: smtpPassword,
                clientId: oAuthID,
                clientSecret: oAuthSecret,
                refreshToken: refreshToken
              }
            });  
              let mailOptions = {
              from: "'The Movie Factory team' <tmfresetservice@gmail.com>",
              to: req.body.recipientEmail,
              subject: 'Password reset link',
              html: `<p>Email reset asked for  ${req.body.recipientEmail}</p>
                      <a target="_blank" href="https://tankarasu.github.io/movie_factory/reset/${req.body.recipientEmail}">
                        <button id="button-ish">Reset Password</button>
                      </a>`
            };
            
            transporter.sendMail(mailOptions, function(err, data) {
              if (err) {
                console.log(timeStamp()+" Sending failed");
                res.send(err);
              } else {
                console.log(timeStamp()+" Email sent successfully");
                res.send("success");
              }
            });
          } else {
            // sinon si found est toujours à false, adresse non trouvée en base
            console.log(timeStamp()+" User not found: "+req.body.email);
            res.send("not found");
          }
        } else {
          // si recipientEmail ne matche pas la regex, renvoie invalid
          console.log(timeStamp()+" Invalid email syntax: "+req.body.email);
          res.send("invalid");
        }
        

    });
  });
});

userRouter.post("/update-user", (req, resp) => {
  User.findOne({ email: req.body.email }).then(user => {
    // s'il n'existe pas d'utilisateur avec cette adresse email, avertissement
    if (!user) {
      resp.status(404).json({ error: "No user with that email found" });
      console.log(timeStamp()+" User not found: "+req.body.email);
      resp.send("not found");
    }
    else {
      bcrypt.hash(req.body.password, rounds, (error, hash) => {
        if (error) {
          resp.status(500).json(error);
          console.log(timeStamp()+" Password hash failed");
          resp.send("failed");
        } else {
            var newPassword = {$set: {password: hash} };
            User.updateOne(user, newPassword, function(err, res) {
              if(err){
                console.log(timeStamp()+" Update failed: "+req.body.email);
                resp.send("failed");
              }else{
                console.log(timeStamp()+" Updated: "+req.body.email);
                resp.send("success");
              }
            });
        }
      });
      
    }
  });


});

userRouter.put("/addfavorite", async (req, res, next) => {
  User.findOne({ email: req.body.email }).then(res => {
    console.log(res, req.body);
    res.favorite.push(req.body.filmId);
    res.save();
  });
});

userRouter.put("/removefavorite", async (req, res, next) => {
  User.findOne({ email: req.body.email }).then(res => {
    // console.log("remove favorite", req.body.filmId);
    // console.log("res", res.favorite);

    for (let i = 0; i < res.favorite.length; i++) {
      if (res.favorite[i].id == req.body.filmId) {
        res.favorite.splice(i, 1);
      }
    }
    res.save();
  });
});

userRouter.put("/seen", async (req, res, next) => {
  User.findOne({ email: req.body.email }).then(res => {
    console.log("seen");
    res.seen.push(req.body.filmId);
    res.save();
  });
});

userRouter.put("/removeseen", async (req, res, next) => {
  User.findOne({ email: req.body.email }).then(res => {
    console.log("remove seen");
    // console.log("remove favorite", req.body.filmId);
    // console.log("res", res.favorite);
    console.log("req", req);

    for (let i = 0; i < res.seen.length; i++) {
      console.log(res.seen[i].id);
      if (res.seen[i].id == req.body.id) {
        res.seen.splice(i, 1);
      }
    }
    res.save();
  });
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

function timeStamp() {
  let ts = new Date();
  return `${ts.getUTCDay()}-${ts.getUTCMonth()}-${ts.getUTCFullYear()}-${ts.getHours()}:${ts.getMinutes()}:${ts.getSeconds()}`;
}