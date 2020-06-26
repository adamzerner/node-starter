const nodemailer = require("nodemailer");
const {
  developmentTransportOptions,
  productionTransportOptions,
} = require("../../config/mail");
const PASSWORD_CHANGE_EMAIL = require("../../emails/password-change");

module.exports = (req, res) => {
  if (!req.body.newPassword) {
    return res.status(422).json({
      errors: ["A new password is required."],
    });
  }

  if (req.body.newPassword.length < 6) {
    return res.status(422).json({
      errors: ["New password is too short. It must beat least 6 characters."],
    });
  }

  if (!req.user.validatePassword(req.body.oldPassword)) {
    return res.status(403).json({
      errors: ["Old password is incorrect."],
    });
  }

  const mailTransport = nodemailer.createTransport(
    process.env.NODE_ENV === "production"
      ? productionTransportOptions
      : developmentTransportOptions
  );

  req.user.setPassword(req.body.newPassword);
  req.user
    .save()
    .then((userInstance) => {
      const mailOptions = {
        to: userInstance.email,
        from: '"VueStarter" <contact@vuestarter.com>',
        subject: "Your password has been changed",
        html: PASSWORD_CHANGE_EMAIL,
      };

      mailTransport.sendMail(mailOptions, function (err, info) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            `Password change email: ${nodemailer.getTestMessageUrl(info)}`
          );
        }

        res.status(200).json({
          status: "Success",
        });
      });
    })
    .catch(() => {
      res.status(500).json({
        errors: ["Internal server error."],
      });
    });
};
