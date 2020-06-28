const sendEmail = require("./send-email");
const PASSWORD_CHANGE_EMAIL = require("../emails/password-change");

module.exports = (to) => {
  return sendEmail(to, PASSWORD_CHANGE_EMAIL, "Password change email: ");
};
