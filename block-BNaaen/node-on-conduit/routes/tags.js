var express = require("express");
var router = express.Router();
var Article = require("../models/Article");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    var articles = await Article.find();
    var allTags = await [];
    articles.forEach((article) => {
      article.tagList.forEach((tag) => {
        allTags.push(tag);
      });
    });
    allTags = allTags.filter((item, id) => {
      if (id === allTags.indexOf(item)) {
        return item;
      }
    });
    res.json({ allTags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
