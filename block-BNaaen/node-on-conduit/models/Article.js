var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: { type: String },
    title: { type: String },
    description: { type: String },
    body: { type: String },
    tagList: { type: [String] },
    favorited: { type: Boolean, default: false },
    favoritesCount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Article", articleSchema);
