const mongoose = require("mongoose");
const crypto = require("crypto");
const defaultSettings = require("./default-settings");
let UserSchema;
let User;

UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => {
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
UserSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.validatePassword = (password) => {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");

  return this.hash === hash;
};
UserSchema.statics.findByEmail = (email) => {
  return this.findOne({ email: email });
};
UserSchema.statics.findOneOrCreate = (condition, callback) => {
  const self = this;

  return self.findOne(condition).then((userInstance) => {
    if (!userInstance) {
      return self.create(condition).then((userInstance) => ({
        userInstance: userInstance,
        foundOrCreated: "created",
      }));
    }

    return { userInstance: userInstance, foundOrCreated: "found" };
  });
};
User = mongoose.model("User", UserSchema);

module.exports = User;
