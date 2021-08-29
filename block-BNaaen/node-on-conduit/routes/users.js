var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/", async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    var userId = user._id;
    var updatedUser = await User.findByIdAndUpdate(userId, { token: token });
    var profile = await user.profile(token);
    res.status(200).json({ profile, token });
  } catch (error) {
    next(error);
  }
});
router.post("/login", async function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Enter Email/Password" });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "User not found" });
    } else {
      var result = await user.verifyPassword(password);
      if (!result) {
        res.status(400).json({ error: "Wrong Password" });
      } else {
        //Correct Password
        var profile = await user.profile();
        req.session.userId = user._id;
        res.json({ profile });
      }
    }
  } catch (error) {
    return next(error);
  }
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ msg: "Logged out Successfully" });
});

module.exports = router;
