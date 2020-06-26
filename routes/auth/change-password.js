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

  req.user.setPassword(req.body.newPassword);
  req.user
    .save()
    .then((userInstance) => {
      // let mailOptions = {
      //   to: userInstance.email,
      //   from: '"Premium Poker Tools" <contact@premiumpokertools.com>',
      //   subject: "Your password has been changed",
      //   html: PASSWORD_CHANGE_EMAIL,
      // };
      //
      // mailTransporter.sendMail(mailOptions, function (err) {
      res.status(200).json({
        status: "Success",
      });
    })
    // })
    .catch(() => {
      res.status(500).json({
        errors: ["Internal server error."],
      });
    });
};
