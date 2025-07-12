require("dotenv").config();
const axios = require("axios");

const BUNDLER_URL = process.env.BUNDLER_URL;

async function sendUserOperation(userOp) {
  try {
    const response = await axios.post(`${BUNDLER_URL}/userOp`, userOp);
    return response.data;
  } catch (error) {
    console.error("❌ Bundler submission failed:", error.message);
    throw new Error("Failed to send UserOperation");
  }
}

module.exports = { sendUserOperation };
