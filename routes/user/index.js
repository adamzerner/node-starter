const express = require("express");
const router = express.Router();

router.put("/", require("./update"));
router.post("/checkout-session", require("./checkout-session"));

module.exports = router;
