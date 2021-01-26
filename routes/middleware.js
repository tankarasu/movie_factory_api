// import du jwt 
const jwt = require("jsonwebtoken");
// initialisation de la signature pour décrypter 
const tokenSecret = "my-secret-token";

// export de verify 
exports.verify = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) res.status(403).json({ error: "please provide a token" });
  else {
    // vérifie les arguments du jwt token signature et call back
    jwt.verify(token.split(" ")[1].toString(), tokenSecret, (err, value) => {
      if (err) res.status(500).json({ error: "failed to authenticate token" });
      // else implicite 
      req.user = value.data;
      next();
    });
  }
};
