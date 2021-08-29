var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");
const { findOneAndUpdate } = require("../models/User");

/* GET users listing. */
router.get("/:username", async (req, res, next) => {
  var username = req.params.username;
  var user = await User.findOne({ username });
  var profile = user.profile();
  res.json({ profile });
});

//Follow user
router.post("/:username/follow", auth.loggedInUser, async (req, res, next) => {
  var username = req.params.username;
  var updatedUseruser = await User.findOneAndUpdate(
    { username },
    { following: true }
  );
  var updatedUser = await User.findOne({ username });
  var profile = await updatedUser.profile();
  res.json({ profile });
});

//Unfollow User
router.delete(
  "/:username/follow",
  auth.loggedInUser,
  async (req, res, next) => {
    var username = req.params.username;
    var updatedUseruser = await User.findOneAndUpdate(
      { username },
      { following: false }
    );
    var updatedUser = await User.findOne({ username });
    var profile = await updatedUser.profile();
    res.json({ profile });
  }
);

module.exports = router;
