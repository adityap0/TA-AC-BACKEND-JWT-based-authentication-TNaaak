var express = require("express");
var router = express.Router();
var User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    res.json({ error: "Enter Email/Password" });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      res.json({ error: "User Not Found" });
    } else {
      var result = await user.verifyPassword(password);
      if (!result) {
        res.json({ error: "Wrong Password Entered" });
      } else {
        var token = await user.signToken();
        res.json({ user: user.userJSON(token) });
        console.log(token);
      }
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
