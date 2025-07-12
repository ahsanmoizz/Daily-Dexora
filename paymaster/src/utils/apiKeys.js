const redis = require("./redis");

async function checkApiKey(apiKey) {
  const isValid = await redis.sismember("apiKeys", apiKey);
  if (!isValid) console.log("❌ Invalid API Key:", apiKey);
  return isValid;
}

module.exports = { checkApiKey };
