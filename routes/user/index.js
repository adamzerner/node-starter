const express = require("express");
const router = express.Router();

router.put("/", require("./update"));

module.exports = router;
