const axios = require("axios");

const PAYMASTER_URL = process.env.PAYMASTER_URL;
const API_KEY = process.env.PAYMASTER_API_KEY;

async function getPaymasterData(userOp) {
  try {
    const response = await axios.post(`${PAYMASTER_URL}/validate`, {
      userOp,
      apiKey: API_KEY,
    });

    const { paymasterAndData } = response.data;
    if (!paymasterAndData) {
      throw new Error("Paymaster rejected operation");
    }

    return paymasterAndData;
  } catch (error) {
    console.error("❌ Paymaster error:", error.message);
    return "0x";
  }
}

module.exports = { getPaymasterData };
