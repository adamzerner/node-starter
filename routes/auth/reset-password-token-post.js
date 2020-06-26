const async = require("async");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const PASSWORD_CHANGE_EMAIL = require("../../emails/password-change");
const {
  developmentTransportOptions,
  productionTransportOptions,
} = require("../../config/mail");

module.exports = async (req, res) => {
  let mailTransport = nodemailer.createTransport(
    process.env.NODE_ENV === "production"
      ? productionTransportOptions
      : developmentTransportOptions
  );

  async.waterfall(
    [
      (done) => {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          (err, user) => {
            if (!user) {
              return res.status(403).json({
                errors: ["Password reset token is invalid or has expired."],
              });
            }

            if (!req.body.newPassword) {
              return res.status(422).json({
                errors: ["A new password is required."],
              });
            }

            if (req.body.newPassword.length < 6) {
              return res.status(422).json({
                errors: [
                  "New password is too short. It must beat least 6 characters.",
                ],
              });
            }

            user.setPassword(req.body.newPassword);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            user.save((err) => {
              done(err, user);
            });
          }
        );
      },
      (user, done) => {
        const mailOptions = {
          to: user.email,
          from: '"VueStarter" <noreply@vuestarter.com>',
          subject: "Your password has been changed",
          html: PASSWORD_CHANGE_EMAIL,
        };

        mailTransport.sendMail(mailOptions, (err, info) => {
          if (process.env.NODE_ENV !== "production") {
            console.log(
              `Password change email: ${nodemailer.getTestMessageUrl(info)}`
            );
          }

          res.status(200).json({
            status: "Success",
          });
          done(err, "done");
        });
      },
    ],
    (err) => {
      res.status(500).json({
        status: "Error",
      });
    }
  );
};
