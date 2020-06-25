const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = mongoose.model("User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findByEmail(profile.emails[0].value).then(
        (existingUserWithEmail) => {
          if (existingUserWithEmail && !existingUserWithEmail.googleId) {
            return done(null, false, {
              errors: ["Email is already in use."],
            });
          }

          User.findOneOrCreate(
            {
              googleId: profile.id,
              email: profile.emails[0].value,
            },
            (err, userInstance, foundOrCreated) => {
              let mailOptions = {
                from: '"Premium Poker Tools" <contact@premiumpokertools.com>',
                to: userInstance.email,
                subject: `Welcome to Premium Poker Tools!`,
                html: WELCOME_EMAIL,
              };

              if (foundOrCreated === "created") {
                mailTransporter.sendMail(mailOptions, (err, info) => {
                  done(err, userInstance);
                });
              } else {
                done(err, userInstance);
              }
            }
          );
        }
      );
    }
  )
);
