// import du jwt 
const jwt = require("jsonwebtoken");
// initialisation de la signature pour décrypter 
const tokenSecret = "my-secret-token";

// export de verify pour utilisation par d'autres fichiers
exports.verify = (req, res, next) => {
  // récupération du token dans les headers
  const token = req.headers.authorization;
  // s'il est vide, erreur
  if (!token) res.status(403).json({ error: "please provide a token" });
  else {
    // sinon, sépare le header en deux avec espace en séparateur: 
    // la première partie en index 0 comporte une string: "bearer" (visible quand on utilise postman), et l'index 1 est le token en lui-même
    // on vérifie donc ce token avec la méthode verify du module jwt.
    jwt.verify(token.split(" ")[1].toString(), tokenSecret, (err, value) => {
      if (err) res.status(500).json({ error: "failed to authenticate token" });
      //si pas d'erreur, on renvoie les infos user extraites du token
      req.user = value.data;
      // permet de passer au middleware suivant
      next();
    });
  }
};
