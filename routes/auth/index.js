const express = require("express");
const router = express.Router();
const {
  requireSignedIn,
  requireSignedOut,
} = require("../middleware/permission");

router.post("/register", requireSignedOut, require("./register"));
router.post("/sign-in", requireSignedOut, require("./sign-in"));
router.delete("/sign-out", requireSignedIn, require("./sign-out"));
router.get("/me", require("./me"));
router.get("/default", require("./default"));
router.delete("/", requireSignedIn, require("./delete-account"));
router.patch("/change-password", requireSignedIn, require("./change-password"));
router.post("/reset-password", requireSignedOut, require("./reset-password"));
router.get(
  "/reset-password/:token",
  requireSignedOut,
  require("./reset-password-token-get")
);
router.post(
  "/reset-password/:token",
  requireSignedOut,
  require("./reset-password-token-post")
);

module.exports = router;
