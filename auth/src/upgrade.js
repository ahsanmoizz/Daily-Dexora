import express from "express";
import Redis from "ioredis";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ 1. Create dynamic Stripe checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { dev_id, planName } = req.body;

  if (!dev_id || !planName) {
    return res.status(400).json({ error: "Missing dev_id or planName" });
  }

  const plan = await redis.hgetall(`plan:${planName}`);
  if (!plan?.price || !plan?.txLimit) {
    return res.status(400).json({ error: "Plan not found in Redis" });
  }

  const amount = parseInt(plan.price) * 100;
  const currency = plan.currency || "usd";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Dexora Plan: ${planName}`,
              description: `${plan.txLimit} gasless txs/month`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `https://yourfrontend.com/success?dev=${dev_id}`,
      cancel_url: `https://yourfrontend.com/upgrade`,
      metadata: { dev_id, planName },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe session error:", err.message);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

// ✅ 2. Stripe Webhook to upgrade dev's plan after payment
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const dev_id = session.metadata.dev_id;
    const planName = session.metadata.planName;

    if (dev_id && planName) {
      await redis.hset(`dev:${dev_id}`, "plan", planName);
      console.log(`✅ ${dev_id} successfully upgraded to "${planName}"`);
    }
  }

  res.json({ received: true });
});

export default router;
