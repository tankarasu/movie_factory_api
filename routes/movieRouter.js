// import module express pour création de sa méthode de création de routeur
const express = require("express");
let movieRouter = express.Router();
// import axios pour utilisation avec requêtes API en suivant
const axios = require("axios");

// requête pour les films les plus populaires
// TODO intégrer dans une documentation

//racine de réponse API: http://localhost:3050/api/movie
// réponse si url complète avec api/movie termine par un / sans params supplémentaires
movieRouter.route("/").get((req, response) => {
  axios
    .get( // exécution de la requête
      "https://api.themoviedb.org/3/movie/popular?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=fr-FR&page=1"
    )
    .then(result => { // envoi de la réponse si statut réponse Ok
      response.send(result.data);
    })
    .catch(err => { // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// GET //
// route pour films populaires
// `https://api.themoviedb.org/3/movie/popular?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=fr-FR&page=1`;
// route pour correspondance id et nom de catégories
// `https://api.themoviedb.org/3/genre/movie/list?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=en-US`;

// route principale?
//`https://api.themoviedb.org/3/discover/movie?api_key=d147fe4e04ba78d12adf57c89fb3ad72`;

// route par catégories
//`https://api.themoviedb.org/3/discover/movie?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28`;

// route par année
//`https://api.themoviedb.org/3/discover/movie?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=2020` // route recherche par titre de film
//`https://api.themoviedb.org/3/search/movie?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=en-US&page=1&include_adult=false&query=bird`;

// route recherche par personnes (acteurs ET réalisateurs, etc)
//`https://api.themoviedb.org/3/search/person?api_key=d147fe4e04ba78d12adf57c89fb3ad72&language=en-US&query=pitt&page=1&include_adult=false`;

// Détails acteurs pour chaque film
//`https://api.themoviedb.org/3/movie/405774/credits?language=en-US&api_key=d147fe4e04ba78d12adf57c89fb3ad72`;

// préfixe pour images (poster path obtenu dans les détails de chaque film)
//`https://image.tmdb.org/t/p/w500/`;

// POST //

// PUT //

// DELETE //

// exporte le router pour import dans fichiers tiers
console.log(process.env.API_KEY);
module.exports = movieRouter;
