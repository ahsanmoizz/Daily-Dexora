const Redis = require("ioredis");
const axios = require("axios");

const redis = new Redis(process.env.REDIS_URL);

async function notifyDev(txHash, userOp) {
  const apiKey = userOp?.metadata?.apiKey;
  if (!apiKey) return;

  const webhookUrl = await redis.hget(`dev:${apiKey}`, "webhook");
  if (!webhookUrl) return;

  try {
    await axios.post(webhookUrl, {
      txHash,
      sender: userOp.sender,
      status: "completed",
      timestamp: Date.now(),
      projectId: userOp.metadata?.projectId || "unknown",
    });

    console.log(`✅ Webhook sent to ${webhookUrl}`);
  } catch (err) {
    console.error("❌ Webhook failed:", err.message);
  }
}

module.exports = { notifyDev };
