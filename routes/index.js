const express = require("express");
const router = express.Router();
const { requireSignedIn } = require("./middleware/permission");

router.use("/auth", require("./auth"));
router.use("/sso", require("./sso"));
router.use("/user", requireSignedIn, require("./user"));

module.exports = router;
