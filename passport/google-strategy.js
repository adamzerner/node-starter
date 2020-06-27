const nodemailer = require("nodemailer");
const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = mongoose.model("User");
const {
  developmentTransportOptions,
  productionTransportOptions,
} = require("../config/mail");
const mailTransport = nodemailer.createTransport(
  process.env.NODE_ENV === "production"
    ? productionTransportOptions
    : developmentTransportOptions
);
const WELCOME_EMAIL = require("../emails/welcome");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/sso/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("hit server");
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
              const mailOptions = {
                from: '"VueStarter" <contact@vuestarter.com>',
                to: userInstance.email,
                subject: `Welcome to VueStarter!`,
                html: WELCOME_EMAIL,
              };

              if (foundOrCreated === "created") {
                mailTransport.sendMail(mailOptions, (err, info) => {
                  if (process.env.NODE_ENV !== "production") {
                    console.log(
                      `Welcome email: ${nodemailer.getTestMessageUrl(info)}`
                    );
                  }

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
