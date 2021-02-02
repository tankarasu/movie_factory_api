// importation et configuration de dotenv, afin d'acceder aux données sensibles
// dans la variable d'environnement
require("dotenv").config();
// destructuration des variables d'environnement
let { PORT, mongoURI } = process.env;

// import puis instanciation de expressJS: framework backend
const express = require("express");
// création d'une application express
const app = express();
const bodyParser = require("body-parser");
// configuration DB
const mongoose = require("mongoose");
// cors
const cors = require("cors");
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

// config swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "The Movie Factory API",
      description: "API for login users and fetching films + info",
      contact: {
        name: "Tan KARASU",
      },
      servers: ["http://localhost:3050"],
    },
  },
  apis: ["index.js", "./routes/movieRouter.js"],
};
/**
 * @swagger
 * /api/movie
 * test doc
 */
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;

// TODO gestion des erreurs connections
db.on("error", err => console.error(err));
db.once("open", () => console.log("DB started successfully"));

// import d'un routeur puis utilisation de la route par l'application en l13
const movieRouter = require("./routes/movieRouter.js");
const userRouter = require("./routes/userRouter.js");

// Middleware
// Définition de la route pour arriver sur la requête d'A
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
/**
 * @swagger
 * /api/movie:
 * get:
 *  description: use to request films
 * responses:
 * 200:
 * $description:a succesfully responses
 */
app.use("/api/movie", movieRouter);
app.use("/user", userRouter);

// listening sur de l'application sur le port 3050 puis confirmation en console quand app est start (npm run start)
app.listen(PORT || process.env, () => console.log("listening on port:" + PORT));
