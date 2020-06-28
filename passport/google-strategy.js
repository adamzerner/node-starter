const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const getSsoStrategyCallback = require("./get-sso-strategy-callback");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/sso/google/callback`,
    },
    getSsoStrategyCallback("googleId")
  )
);
