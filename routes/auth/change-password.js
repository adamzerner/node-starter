const sendPasswordChangeEmail = require("../../services/send-password-change-email");

module.exports = async (req, res) => {
  const validationErrors = checkIfPayloadIsValid(req);
  let userInstance;

  if (validationErrors.length > 0) {
    return res.status(422).json({
      errors: validationErrors,
    });
  }

  try {
    req.user.setPassword(req.body.newPassword);
    userInstance = await req.user.save();
    sendPasswordChangeEmail(userInstance.email);
    res.status(200).json({
      status: "Success",
    });
  } catch (e) {
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const checkIfPayloadIsValid = (req) => {
  const validationErrors = [];

  if (!req.body.newPassword) {
    validationErrors.push("A new password is required.");
  } else if (req.body.newPassword.length < 6) {
    validationErrors.push(
      "New password is too short. It must beat least 6 characters."
    );
  }

  if (!req.user.validatePassword(req.body.oldPassword)) {
    validationErrors.push("Old password is incorrect.");
  }

  return validationErrors;
};
