const sendEmail = require("./send-email");
const getPurchaseConfirmationEmail = require("../emails/purchase-confirmation");

module.exports = (to, planType) => {
  return sendEmail(
    to,
    getPurchaseConfirmationEmail(planType),
    "Purchase confirmation email: "
  );
};
