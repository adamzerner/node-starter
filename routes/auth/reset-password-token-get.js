const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
  const user = User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(403).json({
      status: "Password reset token is invalid or has expired.",
    });
  }
  res.status(200).json({
    resetPasswordToken: user.resetPasswordToken,
  });
};
