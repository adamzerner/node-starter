const express = require("express");
const router = express.Router();

router.use("/google", require("./google"));
router.use("/twitter", require("./twitter"));
router.use("/linkedin", require("./linkedin"));

module.exports = router;
