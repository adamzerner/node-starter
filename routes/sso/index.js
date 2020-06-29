const express = require("express");
const router = express.Router();
const setMaxAgeOfCookie = (req, res, next) => {
  req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
  next();
};

router.use("/google", setMaxAgeOfCookie, require("./google"));
router.use("/twitter", setMaxAgeOfCookie, require("./twitter"));
router.use("/linkedin", setMaxAgeOfCookie, require("./linkedin"));

module.exports = router;
