const permission = require("../middleware/permission");
const router = require("express").Router();
const passport = require("passport");

router.get("/", permission.requireSignedOut, passport.authenticate("twitter"));

router.get(
  "/callback",
  passport.authenticate("twitter", {
    successRedirect: `${process.env.BASE_CLIENT_URL}/account`,
    failureRedirect: `${process.env.BASE_CLIENT_URL}/sign-in?error=email-in-use`,
  })
);

module.exports = router;
