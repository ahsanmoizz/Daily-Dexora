const { checkApiKey } = require("./utils/apiKeys");
const { validateFreemium } = require("./policies/freemium");
const { validateWhitelist } = require("./policies/whitelist");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimit(apiKey, projectId) {
  if (!apiKey || !projectId) throw new Error("Missing apiKey or projectId");

  const plan = await redis.hget(`dev:${apiKey}`, "plan") || "free";

  const planDetails = await redis.hgetall(`plan:${plan}`);
  const limit = planDetails?.txLimit ? parseInt(planDetails.txLimit) : (plan === "pro" ? 10000 : 5);

  const now = new Date();
  const dateKey = plan === "free"
    ? `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
    : `${now.getFullYear()}-${now.getMonth()}`;

  const usageKey = `usage:${apiKey}:${projectId}:${dateKey}`;
  const currentUsage = parseInt(await redis.get(usageKey)) || 0;

  if (currentUsage >= limit) {
    throw new Error(`⛔ Limit reached for ${plan} plan on project ${projectId}`);
  }

  await redis.incr(usageKey);
  await redis.expire(usageKey, plan === "free" ? 86400 : 2592000);
}

async function validateUserOp(userOp) {
  const apiKey = userOp?.metadata?.apiKey;
  const projectId = userOp?.metadata?.projectId;

  if (!apiKey || !projectId) throw new Error("❌ Missing apiKey or projectId in metadata");

  // 🔒 Platform paused check
  const stopped = await redis.get("platform:stopped");
  if (stopped === "true") throw new Error("🚫 Daily Dexora is currently paused by admin.");

  // 🔒 Blocked developer check
  const blocked = await redis.hget(`dev:${apiKey}`, "blocked");
  if (blocked === "true") throw new Error("🚫 Developer account is blocked.");

  const isValidKey = await checkApiKey(apiKey);
  if (!isValidKey) throw new Error("❌ Invalid API Key");

  // ✅ Whitelisted users skip checks
  const whitelisted = await validateWhitelist(userOp.sender);
  if (whitelisted) return whitelisted;

  // ✅ Enforce usage limit
  await checkRateLimit(apiKey, projectId);

  // ✅ Optional freemium business logic
  const freemium = await validateFreemium(apiKey);
  if (freemium) return freemium;

  throw new Error("❌ UserOp not eligible for sponsorship");
}

module.exports = { validateUserOp };
