var express = require("express");
var router = express.Router();
var slug = require("slug");

module.exports = router;
var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("jsonwebtoken");
var auth = require("../middlewares/auth");
var Article = require("../models/Article");
var Comment = require("../models/Comment");

//Filter Article
router.get("/", async (req, res, next) => {
  try {
    //filter by Tag
    if (req.query.tag) {
      var tag = req.query.tag.toUpperCase();
      var articlesbyTag = await Article.find({ tagList: { $all: [tag] } });
      if (articlesbyTag.length !== 0) {
        res.status(200).json({ articlesbyTag });
      } else {
        res.status(400).json({ msg: `No Articles found for ${tag} search` });
      }
      //filter by Author
    } else if (req.query.author) {
      var author = req.query.author;
      var articles = await Article.find({}).populate("author");
      articles = articles.filter((art) => {
        if (art.author.name == author) {
          return art;
        }
      });
      if (articles.length !== 0) {
        res.status(200).json({ articles });
      } else {
        res.status(400).json({ msg: "No Articles found for this Author" });
      }
    }
    //Filter by user favourtited
    else if (req.author.favorited) {
      var targetUser = req.author.favorited;
      var articles = await Article.find({}).populate("author");
      articles = articles.filter((art) => {
        if (art.author.name == targetUser) {
          return art;
        }
      });
      console.log(articles);
    }
  } catch (error) {
    next(error);
  }
});
//CREATE ARTICLE
router.post("/", auth.userInfo, auth.loggedInUser, async (req, res, next) => {
  req.body.tagList = req.body.tagList.split(",");
  req.body.slug = slug(req.body.title);
  req.body.tagList = req.body.tagList.map((item) => {
    return item.trim().toUpperCase();
  });
  req.body.author = req.user._id;
  try {
    var article = await Article.create(req.body);
    res.json({ article });
  } catch (error) {
    next(error);
  }
});

//Update Article

router.put(
  "/:slug",
  auth.validateToken,
  auth.loggedInUser,
  async (req, res, next) => {
    var findSlug = req.params.slug;
    req.body.tagList = req.body.tagList.split(",");
    req.body.tagList = req.body.tagList.map((item) => {
      return item.trim().toUpperCase();
    });
    req.body.slug = slug(req.body.title);
    req.body.author = req.user._id;
    try {
      var article = await Article.findOneAndUpdate(
        { slug: findSlug },
        req.body
      );
      res.status(200).json({ article });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
router.delete(
  "/:slug",
  auth.loggedInUser,
  auth.validateToken,
  async (req, res, next) => {
    var findSlug = req.params.slug;
    var article = await Article.findOneAndDelete({ slug: findSlug });
    res.json({ article, msg: "deleted" });
  }
);
//POST /api/articles/:slug/comments
router.post(
  "/:slug/comments",
  auth.userInfo,
  auth.validateToken,
  auth.loggedInUser,
  async (req, res, next) => {
    try {
      var slug = await req.params.slug;
      var article = await Article.findOne({ slug });
      var articleId = await article._id;
      req.body.article = await article._id;
      req.body.author = await req.user.userId;
      var comment = await Comment.create(req.body);
      var commentId = await comment._id;
      var updatedArticle = await Article.findByIdAndUpdate(articleId, {
        $push: { comments: commentId },
      });
      res.status(200).json({ msg: "Comment Addedd successfully!!", comment });
    } catch (error) {
      next(error);
    }
  }
);
// DELETE /api/articles/:slug/comments/:id
router.delete("/:slug/comments/:id", async (req, res, next) => {
  var commentId = req.params.id;
  var slug = req.params.slug;
  console.log(slug, commentId);
  try {
    var comment = await Comment.findOneAndDelete(commentId);
    var article = await Article.findOneAndUpdate(
      { slug },
      { $pull: { comments: commentId } }
    );
    res.status(200).json({ msg: "Comment deleted Successfully" });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
