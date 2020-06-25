const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    (email, password, done) => {
      User.findByEmail(email)
        .then((user) => {
          if (!user) {
            return done(null, false, {
              errors: ["Email and/or password is invalid."],
            });
          } else if (!user.validatePassword(password)) {
            return done(null, false, {
              errors: ["Email and/or password is invalid."],
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
