const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const userFromReq = req.body.user;
  const validationErrors = checkIfUserIsValid(userFromReq);

  if (validationErrors.length > 0) {
    return res.status(422).json({
      errors: validationErrors,
    });
  }

  User.findByEmail(userFromReq.email)
    .then(function (userFromDB) {
      if (userFromDB) {
        return res.status(422).json({
          errors: ["An account with this email already exists."],
        });
      } else {
        const userInstance = new User(userFromReq);

        userInstance.setPassword(userFromReq.password);
        userInstance
          .save()
          .then(function (userInstance) {
            req.login(userInstance, function () {
              // sendWelcomeEmail(userInstance.email);
              res.status(201).json({
                user: {
                  email: userInstance.email,
                  googleId: userInstance.googleId,
                  twitterId: userInstance.twitterId,
                  linkedinId: userInstance.linkedinId,
                  created: userInstance.created,
                  auth: userInstance.auth,
                  settings: userInstance.settings,
                },
              });
            });
          })
          .catch(function () {
            res.status(500);
          });
      }
    })
    .catch(function () {
      res.status(500);
    });
};

const checkIfUserIsValid = (user) => {
  const validationErrors = [];

  if (!user.email) {
    validationErrors.push("An email is required.");
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    validationErrors.push("Email is invalid.");
  }

  if (!user.password) {
    validationErrors.push("A password is required.");
  } else if (user.password.length < 6) {
    validationErrors.push(
      "Password is too short. It must beat least 6 characters."
    );
  }

  return validationErrors;
};

const sendWelcomeEmail = (userEmail) => {
  const mailOptions = {
    from: '"Premium Poker Tools" <contact@premiumpokertools.com>',
    to: userEmail,
    subject: `Welcome to Premium Poker Tools!`,
    html: WELCOME_EMAIL,
  };

  mailTransporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return res.status(500);
    }

    res.status(201).json({
      user: {
        email: userInstance.email,
        googleId: userInstance.googleId,
        twitterId: userInstance.twitterId,
        linkedinId: userInstance.linkedinId,
        created: userInstance.created,
        auth: userInstance.auth,
        emailOptIn: userInstance.emailOptIn,
        savedScenarios: userInstance.savedScenarios,
        settings: userInstance.settings,
      },
    });
  });
};
