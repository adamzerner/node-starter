const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const getSsoStrategyCallback = require("./get-sso-strategy-callback");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.BASE_API_URL}/sso/twitter/callback`,
      includeEmail: true,
    },
    getSsoStrategyCallback("twitterId")
  )
);
