var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    var id = req.user.userID;
    var user = await User.findById(req.user.userId);
    var profile = await user.profile();
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  try {
    let id = req.session.userId;
    var user = await User.findByIdAndUpdate(id, req.body);
    var updatedUser = await User.findById(id);
    var profile = await updatedUser.profile();
    res.json({ profile, msg: "Updated" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
