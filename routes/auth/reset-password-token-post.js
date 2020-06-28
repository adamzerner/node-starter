const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendPasswordChangeEmail = require("../../services/send-password-change-email");

module.exports = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    const validationErrors = checkIfUserIsValid(req, user);

    if (validationErrors.length > 0) {
      return res.status(422).json({
        errors: validationErrors,
      });
    }

    user.setPassword(req.body.newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    await sendPasswordChangeEmail(user.email);
    res.status(200).json({
      status: "Success",
    });
  } catch (e) {
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const checkIfUserIsValid = (req, user) => {
  const validationErrors = [];

  if (!user) {
    validationErrors.push("Password reset token is invalid or has expired.");
  } else if (!req.body.newPassword) {
    validationErrors.push("A new password is required.");
  } else if (req.body.newPassword.length < 6) {
    validationErrors.push(
      "New password is too short. It must beat least 6 characters."
    );
  }
  return validationErrors;
};
