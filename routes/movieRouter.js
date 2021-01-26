// import module express pour création de sa méthode de création de routeur
const express = require("express");
let movieRouter = express.Router();
// import axios pour utilisation avec requêtes API en suivant
const axios = require("axios");

// variables globales
const baseUrl = "https://api.themoviedb.org/3/";
const API_KEY = process.env.API_KEY;

// TODO intégrer dans une documentation
//racine de réponse API: http://localhost:3050/api/movie
// réponse si url complète avec api/movie termine par un / sans params supplémentaires

// GET //
// requête pour les films les plus populaires
movieRouter.route("/").get((request, response) => {
  axios
    .get(
      // exécution de la requête
      `${baseUrl}movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    )
    // envoi de la réponse si statut réponse Ok
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// requêtes pour les films par catégorie
movieRouter.route("/genre/:genre").get((request, response) => {
  axios
    .get(
      `${baseUrl}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${request.params.genre}`
    )
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// requête recherche par année
movieRouter.route("/year/:year").get((request, response) => {
  axios
    .get(
      `${baseUrl}discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&year=${request.params.year}`
    )
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// route recherche par titre de film
movieRouter.route("/title/:title").get((request, response) => {
  axios
    .get(
      `${baseUrl}search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${request.params.title}`
    )
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// route recherche par personnes (acteurs ET réalisateurs, etc)
movieRouter.route("/person/:person").get((request, response) => {
  axios
    .get(
      `${baseUrl}search/person?api_key=${API_KEY}&language=en-US&query=${request.params.person}&page=1&include_adult=false`
    )
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// infos des credits cast et production sur un film
movieRouter.route("/credits/:credits").get((request, response) => {
  axios
    .get(
      `${baseUrl}movie/${request.params.credits}/credits?language=en-US&api_key=${API_KEY}`
    )
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// route pour correspondance id et nom de catégories
movieRouter.route("/categories").get((request, response) => {
  axios
    .get(`${baseUrl}genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(result => response.send(result.data))
    .catch(err => {
      console.log("Erreur de connexion");
      console.log("err:", err.response);
      // TODO gestion de l'erreur
      // sinon erreur renvoyée dans brower/postman
      throw err;
    });
});

// route principale?
//`${baseUrl}discover/movie?api_key=${API_KEY}`;

// préfixe pour images (poster path obtenu dans les détails de chaque film)
//`https://image.tmdb.org/t/p/w500/`;

// POST //

// PUT //

// DELETE //

// exporte le router pour import dans fichiers tiers
module.exports = movieRouter;
