var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/dashboard", auth.validateToken, function (req, res, next) {
  res.json({ access: "dashboard resource" });
});

module.exports = router;
