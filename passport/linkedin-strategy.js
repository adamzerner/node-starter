const nodemailer = require("nodemailer");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
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
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/sso/linkedin/callback`,
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
