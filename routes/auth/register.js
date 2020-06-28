const mongoose = require("mongoose");
const User = mongoose.model("User");
const { sendWelcomeEmail } = require("../../services/send-welcome-email");

module.exports = async (req, res, next) => {
  const userFromReq = req.body.user;
  const validationErrors = checkIfUserIsValid(userFromReq);
  let userFromDB;
  let userInstance;
  let savedUser;

  if (validationErrors.length > 0) {
    return res.status(422).json({
      errors: validationErrors,
    });
  }

  try {
    userFromDB = await User.findByEmail(userFromReq.email);

    if (userFromDB) {
      return res.status(422).json({
        errors: ["An account with this email already exists."],
      });
    }

    userInstance = new User(userFromReq);
    userInstance.setPassword(userFromReq.password);
    savedUser = await userInstance.save();
    req.login(savedUser, async () => {
      await sendWelcomeEmail(savedUser.email);
      res.status(201).json({
        user: {
          email: savedUser.email,
          googleId: savedUser.googleId,
          twitterId: savedUser.twitterId,
          linkedinId: savedUser.linkedinId,
          created: savedUser.created,
          auth: savedUser.auth,
          settings: savedUser.settings,
        },
      });
    });
  } catch (e) {
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
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
