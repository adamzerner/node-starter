const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const TwitterStrategy = require("passport-twitter").Strategy;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/auth/twitter/callback`,
      includeEmail: true,
    },
    (token, tokenSecret, profile, done) => {
      User.findByEmail(profile.emails[0].value).then(
        (existingUserWithEmail) => {
          if (existingUserWithEmail && !existingUserWithEmail.twitterId) {
            return done(null, false, {
              errors: ["Email is already in use."],
            });
          }

          User.findOneOrCreate(
            {
              twitterId: profile.id,
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
