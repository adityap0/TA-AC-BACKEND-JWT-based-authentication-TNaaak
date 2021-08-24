var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", auth.validateToken, function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res
      .status(200)
      .json({ user: user.userJSON(token), msg: "User created successfully!" });
  } catch (error) {
    next(error);
  }
});
router.post("/login", async function (req, res, next) {
  var { email, password } = req.body;
  if (!emai || !password) {
    res.json({ error: "Enter Email/Password" });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.json({ error: "User not found" });
    } else {
      var result = await user.verifyPassword(password);
      if (!result) {
        res.json({ error: "Wrong password entered" });
      } else {
        var token = await user.signToken();
        res
          .status(200)
          .json({ user: user.userJSON(token), msg: "User Created" });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
