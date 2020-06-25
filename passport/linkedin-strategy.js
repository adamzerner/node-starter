const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/user/linkedin/callback`,
      scope: ["r_liteprofile", "r_emailaddress"],
      profileFields: ["email-address"],
      state: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findByEmail(profile.emails[0].value).then(
        (existingUserWithEmail) => {
          if (existingUserWithEmail && !existingUserWithEmail.linkedinId) {
            return done(null, false, {
              errors: ["Email is already in use."],
            });
          }

          User.findOneOrCreate(
            {
              linkedinId: profile.id,
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
