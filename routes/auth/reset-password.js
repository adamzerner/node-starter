const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const getResetPasswordEmail = require("../../emails/reset-password");
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
        crypto.randomBytes(20, (err, buf) => {
          const token = buf.toString("hex");
          done(err, token);
        });
      },
      (token, done) => {
        User.findByEmail(req.body.email).then((user) => {
          if (!user) {
            return res.status(201).json({
              status: "Success", // Note: this wasn't actually a success, but we don't want a hacker to know this
            });
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      async (token, user, done) => {
        const resetPasswordUrl = `${process.env.BASE_CLIENT_URL}/create-new-password/${token}`;
        const mailOptions = {
          to: user.email,
          from: '"VueStarter" <noreply@vuestarter.com>',
          subject: "Reset Password",
          html: getResetPasswordEmail(resetPasswordUrl),
        };

        mailTransport.sendMail(mailOptions, function (err, info) {
          if (process.env.NODE_ENV !== "production") {
            console.log(
              `Reset password email: ${nodemailer.getTestMessageUrl(info)}`
            );
          }

          res.status(201).json({
            status: "Success",
          });
          done(err, "done");
        });
      },
    ],
    (e) => {
      if (e) {
        console.log(e);
        return res.status(500).json({
          errors: ["Unknown error."],
        });
      }
    }
  );
};
