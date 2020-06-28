const sendEmail = require("./send-email");
const WELCOME_EMAIL = require("../emails/welcome");

module.exports = (to) => {
  return sendEmail(to, WELCOME_EMAIL, "Welcome email: ");
};
