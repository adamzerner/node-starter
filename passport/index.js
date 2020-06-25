const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

module.exports = (app) => {
  const SESSION_OPTIONS = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    name: "sessionId",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: app.get("env") === "production" ? true : false,
      sameSite: "none",
    },
  };

  if (app.get("env") === "production") {
    SESSION_OPTIONS.store = new MongoStore({
      mongooseConnection: mongoose.connection,
    });
  }

  app.use(session(SESSION_OPTIONS));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  require("./local-strategy");
  // require("./google-strategy");
  // require("./twitter-strategy");
  // require("./linkedin-strategy");
};
