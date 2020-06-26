const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
  const userId = req.user._id;
  const stripeCustomerId = req.user.stripeCustomerId;

  req.session.destroy(() => {
    User.findById(userId)
      .deleteOne()
      .then(() => {
        if (stripeCustomerId) {
          return stripe.customers.del(stripeCustomerId);
        }
      })
      .then(() => {
        res.status(204).clearCookie("sessionId").json({
          status: "Successful",
        });
      })
      .catch(() => {
        res.status(500).json({
          status: "Internal server error.",
        });
      });
  });
};
