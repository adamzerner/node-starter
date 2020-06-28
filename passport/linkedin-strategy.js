const passport = require("passport");
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const getSsoStrategyCallback = require("./get-sso-strategy-callback");

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
    getSsoStrategyCallback("linkedinId")
  )
);
