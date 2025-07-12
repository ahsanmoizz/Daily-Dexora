import express from "express";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);

// Get all developers
router.get("/devs", async (req, res) => {
  const keys = await redis.keys("dev:*");
  const devs = [];

  for (const key of keys) {
    const id = key.split("dev:")[1];
    const data = await redis.hgetall(key);
    const plan = data.plan || "free";
    const usage = parseInt(data.usage) || 0;

    const planDetails = await redis.hgetall(`plan:${plan}`);
    const txLimit = planDetails?.txLimit ? parseInt(planDetails.txLimit) : (plan === "pro" ? 10000 : 5);

    devs.push({
      id,
      email: data.email || data.wallet || "Unknown",
      plan,
      apiKey: data.apiKey,
      usage,
      txLimit,
      blocked: data.blocked === "true",
    });
  }

  res.json(devs);
});

// Delete a plan
router.post("/admin/delete-plan", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing plan name" });

  await redis.del(`plan:${name}`);
  res.json({ message: "✅ Plan deleted." });
});

// Get all projects for a dev
router.get("/admin/projects/:devId", async (req, res) => {
  const ids = await redis.smembers(`projects:${req.params.devId}`);
  const projects = [];

  for (const id of ids) {
    const data = await redis.hgetall(`project:${id}`);
    projects.push(data);
  }

  res.json(projects);
});

// Update a dev's plan
router.post("/update-plan", async (req, res) => {
  const { devId, newPlan } = req.body;
  if (!devId || !newPlan) return res.status(400).json({ error: "Missing devId or newPlan" });

  await redis.hset(`dev:${devId}`, "plan", newPlan);
  res.json({ success: true });
});

// Add or update a plan
router.post("/admin/plans", async (req, res) => {
  const { name, txLimit, price, currency = "usd" } = req.body;
  if (!name || !txLimit || !price) return res.status(400).json({ error: "Missing plan fields" });

  await redis.hset(`plan:${name}`, {
    name,
    txLimit,
    price,
    currency,
  });

  res.json({ message: `✅ Plan '${name}' added.` });
});

// Block or unblock a dev
router.post("/admin/block-dev", async (req, res) => {
  const { devId, block } = req.body;
  if (!devId) return res.status(400).json({ error: "Missing devId" });

  await redis.hset(`dev:${devId}`, "blocked", block ? "true" : "false");
  res.json({ message: `${block ? "Blocked" : "Unblocked"} dev ${devId}` });
});

// (Duplicate route but kept for compatibility)
router.post("/admin/block", async (req, res) => {
  const { devId, block } = req.body;
  await redis.hset(`dev:${devId}`, "blocked", block ? "true" : "false");
  res.json({ message: `${block ? "Blocked" : "Unblocked"} dev ${devId}` });
});

// Assign plan manually
router.post("/admin/assign-plan", async (req, res) => {
  const { devId, plan } = req.body;
  await redis.hset(`dev:${devId}`, "plan", plan);
  res.json({ message: `✅ Developer '${devId}' set to plan '${plan}'` });
});

// Get dev details
router.get("/admin/dev/:devId", async (req, res) => {
  const dev = await redis.hgetall(`dev:${req.params.devId}`);
  res.json(dev);
});

// Get platform status
router.get("/admin/platform-status", async (req, res) => {
  const stopped = await redis.get("platform:stopped");
  res.json({ stopped: stopped === "true" });
});

// Toggle platform-wide emergency stop
router.post("/admin/platform-status", async (req, res) => {
  const { stopped } = req.body;
  await redis.set("platform:stopped", stopped ? "true" : "false");
  res.json({ message: `Platform ${stopped ? "stopped" : "resumed"}` });
});

// Get all plans
router.get("/admin/plans", async (req, res) => {
  const keys = await redis.keys("plan:*");
  const plans = [];

  for (const key of keys) {
    const data = await redis.hgetall(key);
    plans.push(data);
  }

  res.json(plans);
});

// Get all plans in a key:value structure
router.get("/admin/all-plans", async (req, res) => {
  const keys = await redis.keys("plan:*");
  const result = {};
  for (const key of keys) {
    const name = key.split("plan:")[1];
    result[name] = await redis.hgetall(key);
  }
  res.json(result);
});

export default router;
