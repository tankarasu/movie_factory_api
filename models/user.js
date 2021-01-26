// import nécessaires
const mongoose = require("mongoose");

// typage du modèle
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
