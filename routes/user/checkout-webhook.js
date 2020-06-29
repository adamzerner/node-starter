// refer to https://stripe.com/docs/payments/checkout/accept-a-payment#payment-success
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const mongoose = require("mongoose");
const User = mongoose.model("User");
const url = require("url");
const sendPurchaseConfirmationEmail = require("../../services/send-purchase-confirmation-email");

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const planType = url.parse(session.success_url, true).query.plan;
    const userId = url.parse(session.success_url, true).query["user-id"];
    const user = await User.findById(userId).exec();

    giveAuthToUser(user, planType);

    try {
      sendPurchaseConfirmationEmail(user.email, planType);
      await user.save();
    } catch (e) {
      return res.status(500);
    }
  }

  res.json({ received: true });
};

const giveAuthToUser = (user, planType) => {
  if (planType === "basic" && user.auth.length === 0) {
    user.auth.push("basic");
  } else if (planType === "premium") {
    remove(user.auth, "basic");
    remove(user.auth, "premium");
    user.auth.push("premium");
  }
};

const remove = (auth, planType) => {
  const i = auth.indexOf(planType);

  if (i > -1) {
    auth.splice(i, 1);
  }
};
