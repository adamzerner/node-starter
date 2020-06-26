const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const {
  developmentTransportOptions,
  productionTransportOptions,
} = require("../../config/mail");
const WELCOME_EMAIL = require("../../emails/welcome");

module.exports = (req, res, next) => {
  const userFromReq = req.body.user;
  const validationErrors = checkIfUserIsValid(userFromReq);
  const mailTransport = nodemailer.createTransport(
    process.env.NODE_ENV === "production"
      ? productionTransportOptions
      : developmentTransportOptions
  );

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
              const mailOptions = {
                from: '"VueStarter" <contact@vuestarter.com>',
                to: userInstance.email,
                subject: "Welcome to VueStarter!",
                html: WELCOME_EMAIL,
              };
              mailTransport.sendMail(mailOptions, (err, info) => {
                if (err) {
                  return res.status(500);
                }

                if (process.env.NODE_ENV !== "production") {
                  console.log(
                    `Welcome email: ${nodemailer.getTestMessageUrl(info)}`
                  );
                }

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
            });
          })
          .catch((err) => {
            res.status(500);
          });
      }
    })
    .catch((err) => {
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
