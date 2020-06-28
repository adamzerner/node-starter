const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = async (req, res) => {
  try {
    if (!["basic", "premium"].includes(req.body.plan)) {
      return res.status(422).json({
        errors: ["Plan must be basic or premium"],
      });
    }

    const priceId = getPriceId(req.body.plan);
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_CLIENT_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_CLIENT_URL}/purchase`,
    });

    res.status(201).json({
      sessionId: checkoutSession.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};

const getPriceId = (plan) => {
  if (plan === "basic") {
    return process.env.STRIPE_BASIC_PLAN_PRICE_ID;
  } else if (plan === "premium") {
    return process.env.STRIPE_PREMIUM_PLAN_PRICE_ID;
  }
};
