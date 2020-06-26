const nodemailer = require("nodemailer");
const testAccount = {
  user: "gail.nader67@ethereal.email",
  pass: "K6dazQPZbwhB6TKGJF",
};

module.exports = {
  productionTransportOptions: {
    host: null,
    port: null,
    secure: true,
    auth: {
      user: null,
      pass: null,
    },
  },
  developmentTransportOptions: {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  },
};
