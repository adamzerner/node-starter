let mongoose = require("mongoose");
let crypto = require("crypto");
let defaultSettings = require("./default-settings");
let UserSchema;
let User;

UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (email) {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: "Invalid email",
    },
  },
  hash: String,
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  googleId: String,
  twitterId: String,
  linkedinId: String,
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
  auth: {
    type: [String],
    required: true,
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: defaultSettings,
  },
  stripeCustomerId: String,
});
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.validatePassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");

  return this.hash === hash;
};
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};
UserSchema.statics.findOneOrCreate = function (condition, callback) {
  let self = this;

  self.findOne(condition, function (err, result) {
    if (result) {
      return callback(err, result, "found");
    }

    self.create(condition, function (err, result) {
      return callback(err, result, "created");
    });
  });
};
User = mongoose.model("User", UserSchema);

module.exports = User;
