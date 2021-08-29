var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    token: { type: String },
    username: { type: String, unique: true, required: true },
    bio: { type: String },
    image: { type: String },
    following: { type: Boolean, default: false },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } else {
      next();
    }
  } catch (error) {
    return next(error);
  }
});
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};
userSchema.methods.profile = function (token) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    following: this.following,
    token: token,
  };
};

userSchema.methods.signToken = async function () {
  var payload = { userId: this.id, email: this.email };
  try {
    var token = await jwt.sign(payload, "conduit");
    return token;
  } catch (error) {
    return error;
  }
};

module.exports = mongoose.model("User", userSchema);
