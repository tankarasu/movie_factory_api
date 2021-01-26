const jwt = require("jsonwebtoken");
const tokenSecret = "my-secret-token";

exports.verify = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) res.status(403).json({ error: "please provide a token" });
  else {
    jwt.verify(token.split(" ")[1].toString(), tokenSecret, (err, value) => {
      console.log(token.split(" ")[1]);
      if (err) res.status(500).json({ error: "failed to authenticate token" });
      req.user = value.data;
      next();
    });
  }
};
