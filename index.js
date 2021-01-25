// importation et configuration de dotenv, afin d'acceder aux données sensibles
// dans la variable d'environnement
require("dotenv").config();
// destructuration des variables d'environnement
let { API_KEY, PORT } = process.env;

// import puis instanciation de expressJS: framework backend
const express = require("express");
const app = express(); // création d'une application express

// import d'un routeur puis utilisation de la route par l'application en l13
const movieRouter = require("./routes/movieRouter.js");
//Définition de la route pour arriver sur la requête d'A
app.use("/api/movie", movieRouter);

// listening sur de l'application sur le port 3050 puis confirmation en console quand app est start (npm run start)
app.listen(PORT, () => console.log("listening on port:" + PORT));
