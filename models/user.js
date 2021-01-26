// import nécessaires
// bibliotheque qui sert à gérer la base de données
const mongoose = require("mongoose");

// typage du modèle
// schema d'infos utilisateurs avec objets email et password
const model = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// export du model
module.exports = new mongoose.model("User", model);
