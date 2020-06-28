const mongoose = require("mongoose");
const User = mongoose.model("User");
const { sendWelcomeEmail } = require("../services");

module.exports = (ssoId) => {
  return async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUserWithEmail = await User.findByEmail(
        profile.emails[0].value
      );

      if (existingUserWithEmail && !existingUserWithEmail[ssoId]) {
        return done(null, false, {
          errors: ["Email is already in use."],
        });
      }

      const { userInstance, foundOrCreated } = await User.findOneOrCreate({
        [ssoId]: profile.id,
        email: profile.emails[0].value,
      });

      if (foundOrCreated === "created") {
        await sendWelcomeEmail(userInstance.email);
      }

      done(err, userInstance);
    } catch (e) {
      return done(null, false, {
        errors: ["Internal server error."],
      });
    }
  };
};
