// importation et configuration de dotenv, afin d'acceder aux données sensibles
// dans la variable d'environnement
require("dotenv").config();
// destructuration des variables d'environnement
let { API_KEY, PORT } = process.env;

// config expressJS
const express = require("express");
const app = express();

// routes
const movieRouter = require("./routes/movieRouter.js");
app.use('/',movieRouter)

// listening
app.listen(PORT, () => console.log("listening on port:" + PORT));
