const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
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
                status: "Password reset token is invalid or has expired.",
              });
            }

            if (!req.body.newPassword) {
              return res.status(422).json({
                errors: ["A new password is required."],
              });
            }

            if (req.body.newPassword.length < 8) {
              return res.status(422).json({
                errors: [
                  "New password is too short. It must beat least 8 characters.",
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
        let mailOptions = {
          to: user.email,
          from: '"Premium Poker Tools" <contact@premiumpokertools.com>',
          subject: "Your password has been changed",
          html: PASSWORD_CHANGE_EMAIL,
        };

        mailTransporter.sendMail(mailOptions, (err) => {
          res.status(200).json({
            status: "Success",
          });
          done(err);
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
