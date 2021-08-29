var User = require("../models/User");
var jwt = require("jsonwebtoken");
module.exports = {
  loggedInUser: async (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(400).json({ error: "There is no logged in User" });
    }
  },
  userInfo: async (req, res, next) => {
    var userId = req.session && req.session.userId;
    try {
      if (userId) {
        var user = await User.findById(userId, "username email");
        req.user = user;
        res.locals.user = user;
        next();
      } else {
        req.user = null;
        res.locals.user = null;
        next();
      }
    } catch (error) {
      return next(error);
    }
  },
  validateToken: async (req, res, next) => {
    var userId = await req.session.userId;
    var user = await User.findById(userId);
    var token = await user.token;
    try {
      if (token) {
        var payload = await jwt.verify(token, "conduit");
        req.user = payload;
        next();
      } else {
        res.status(400).json({ error: "Token Required. Please Log In" });
      }
    } catch (error) {
      next(error);
    }
  },
};
