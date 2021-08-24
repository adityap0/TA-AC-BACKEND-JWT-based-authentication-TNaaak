var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(this.password, password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  var payload = { userId: this._id, email: this.email };
  try {
    var token = await jwt.sign(payload, "jwtsecret");
    return token;
  } catch (error) {
    return error;
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
