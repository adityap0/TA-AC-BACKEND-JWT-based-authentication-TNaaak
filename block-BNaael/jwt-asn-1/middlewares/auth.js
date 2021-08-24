var jwt = require("jsonwebtoken");

module.exports = {
  validateToken: async (req, res, next) => {
    var token = req.headers.authorization;
    try {
      if (token) {
        var payload = await jwt.verify(token, "jwtsecret");
        req.user = payload;
        next();
      } else {
        res.status(400).json({ error: "Token Required" });
      }
    } catch (error) {
      next(error);
    }
  },
};
