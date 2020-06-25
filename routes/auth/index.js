const express = require("express");
const router = express.Router();

router.post("/register", require("./register"));
router.post("/sign-in", require("./sign-in"));

module.exports = router;
