const redis = require("../utils/redis");

async function validateFreemium(apiKey) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${apiKey}:${today}`;

  const usage = parseInt(await redis.get(key) || "0");
  if (usage >= 5) {
    console.log("❌ Freemium limit reached for", apiKey);
    return false;
  }

  await redis.incr(key);
  await redis.expire(key, 86400); // 24 hours
  console.log(`✅ Freemium ok (${usage + 1}/5) for ${apiKey}`);

  return { paymasterAndData: "0xYourPaymasterAddress" };
}

module.exports = { validateFreemium };
