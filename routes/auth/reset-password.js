const async = require("async");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
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
      (token, user, done) => {
        const resetPasswordUrl = `${process.env.BASE_CLIENT_URL}/create-new-password/${token}`;
        const mailOptions = {
          to: user.email,
          from: '"Premium Poker Tools" <contact@premiumpokertools.com>',
          subject: "Reset Password",
          html: resetPasswordEmailFactory(resetPasswordUrl),
        };

        mailTransporter.sendMail(mailOptions, (err) => {
          res.status(201).json({
            status: "Success",
          });
          done(err, "done");
        });
      },
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "Unknown error.",
        });
      }
    }
  );
};
