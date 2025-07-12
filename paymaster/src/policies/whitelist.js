const redis = require("../utils/redis");

async function validateWhitelist(sender) {
  const isAllowed = await redis.sismember("whitelist", sender);
  if (isAllowed) {
    console.log("✅ Sender whitelisted:", sender);
    return { paymasterAndData: "0xYourPaymasterAddress" };
  }
  return false;
}

module.exports = { validateWhitelist };
