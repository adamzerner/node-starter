const nodemailer = require("nodemailer");
const {
  developmentTransportOptions,
  productionTransportOptions,
} = require("../config/mail");
const mailTransport = nodemailer.createTransport(
  process.env.NODE_ENV === "production"
    ? productionTransportOptions
    : developmentTransportOptions
);

module.exports = (to, emailTemplate, logMessageLabel = "") => {
  const mailOptions = {
    from: '"VueStarter" <contact@vuestarter.com>',
    to: to,
    subject: `Welcome to VueStarter!`,
    html: emailTemplate,
  };

  return mailTransport.sendMail(mailOptions).then((info) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`${logMessageLabel}${nodemailer.getTestMessageUrl(info)}`);
    }
  });
};
