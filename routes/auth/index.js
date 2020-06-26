const express = require("express");
const router = express.Router();

router.post("/register", require("./register"));
router.post("/sign-in", require("./sign-in"));
router.delete("/sign-out", require("./sign-out"));
router.get("/me", require("./me"));
router.get("/default", require("./default"));
router.delete("/", require("./delete-account"));

module.exports = router;
