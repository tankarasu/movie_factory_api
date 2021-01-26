// import de modules
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const rounds = 10;

// routes
// connexion
userRouter.get("/login", (req, res) => {
  res.send("login");
});

// inscription
// TODO gestion d'erreur
userRouter.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) {
      console.log("error", error);
      res.status(500).json(error);
    } else {
      const newUser = User({ email: req.body.email, password: hash });
      console.log(hash);
      newUser
        .save()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(error));
    }
  });
});

// TODO gestion des erreurs

// export
module.exports = userRouter;
