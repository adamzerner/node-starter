const passport = require("passport");

module.exports = (req, res, next) => {
  const userFromReq = req.body.user;
  const validationErrors = checkIfUserIsValid(userFromReq);

  if (validationErrors.length > 0) {
    return res.status(422).json({
      errors: validationErrors,
    });
  }

  return passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      req.login(user, function (err) {
        if (err) {
          res.status(500).json({
            errors: ["Internal server error"],
          });
        } else {
          if (req.body.keepMeSignedIn) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
          }

          res.json({
            user: {
              email: user.email,
              googleId: user.googleId,
              twitterId: user.twitterId,
              linkedinId: user.linkedinId,
              created: user.created,
              auth: user.auth,
              settings: user.settings,
            },
          });
        }
      });
    } else {
      res.status(400).json(info);
    }
  })(req, res, next);
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
