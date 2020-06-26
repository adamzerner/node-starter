const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        return res.status(403).json({
          status: "Password reset token is invalid or has expired.",
        });
      }
      res.status(200).json({
        resetPasswordToken: user.resetPasswordToken,
      });
    }
  );
};
