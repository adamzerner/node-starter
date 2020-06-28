const express = require("express");
const router = express.Router();
const { requireSignedIn } = require("../middleware/permission");

router.put("/", requireSignedIn, require("./update"));
router.post("/checkout-session", require("./checkout-session"));
router.post("/checkout-webhook", require("./checkout-webhook"));

module.exports = router;
