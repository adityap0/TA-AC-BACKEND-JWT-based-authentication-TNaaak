var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
});

//hash password
userSchema.pre("save", async function (next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (err) {
    next(err);
  }
  bcrypt.compare();
};
userSchema.methods.signToken = async function () {
  console.log(this);
  var payload = { userId: this.id, email: this.email };
  try {
    var token = await jwt.sign(payload, "thisisasecret");
    return token;
  } catch (err) {
    return err;
  }
};
userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};
module.exports = mongoose.model("User", userSchema);
