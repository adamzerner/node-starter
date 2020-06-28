const sendEmail = require("./send-email");
const getResetPasswordEmail = require("../emails/reset-password");

module.exports = (to, token) => {
  const resetPasswordUrl = `${process.env.BASE_CLIENT_URL}/create-new-password/${token}`;

  return sendEmail(
    to,
    getResetPasswordEmail(resetPasswordUrl),
    "Reset password email: "
  );
};
