const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendResetPasswordEmail = require("../../services/send-reset-password-email");

module.exports = async (req, res) => {
  try {
    const token = crypto.randomBytes(20).toString("hex");
    const user = await User.findByEmail(req.body.email);

    if (!user) {
      return res.status(201).json({
        status: "Success", // Note: this wasn't actually a success, but we don't want a hacker to know that
      });
    }

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    sendResetPasswordEmail(user.email, token);
    res.status(201).json({
      status: "Success",
    });
  } catch (e) {
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};
