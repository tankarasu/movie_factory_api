// import de modules
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const rounds = 10;
const jwt = require("jsonwebtoken");
const tokenSecret = "my-secret-token";
const middleware = require("./middleware.js");

// routes
// connexion
userRouter.get("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) res.status(404).json({ error: "no user with that email found" });
    else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) res.status(500).json(error);
        else if (match) res.status(200).json({ token: generateToken(user) });
        else res.status(403).json({ error: "the password is invalid" });
      });
    }
  });
});

// inscription
// TODO gestion d'erreur
userRouter.post("/signup", (req, res) => {
  let users = [];
  User.find({})
    .exec()
    .then(item => {
      users = [...item];
      isValid = true;
      const regex = new RegExp(
        "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-.]+$"
      );
      console.log("regex", regex.test(req.body.email));
      if (regex.test(req.body.email)) {
        users.forEach(element => {
          if (element.email == req.body.email) {
            isValid = false;
          }
        });

        if (isValid) {
          bcrypt.hash(req.body.password, rounds, (error, hash) => {
            if (error) {
              console.log("error", error);
              res.status(500).json(error);
            } else {
              const newUser = User({
                email: req.body.email,
                password: hash,
              });
              newUser
                .save()
                .then(user =>
                  res.status(200).json({ token: generateToken(user) })
                )
                .catch(error => res.status(500).json(error));
            }
          });
        } else {
          res.send("email déja utilisé");
        }
      } else {
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