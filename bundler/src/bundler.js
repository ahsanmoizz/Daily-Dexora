const { ethers } = require("ethers");
const { getMempool, clearMempool } = require("./mempool");
const ENTRYPOINT_ABI = require("./utils/entryPointABI.json");
const { notifyDev } = require("./webhookNotifier"); // ✅ Add this line
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.BUNDLER_PRIVATE_KEY, provider);

const entryPoint = new ethers.Contract(
  process.env.ENTRYPOINT_ADDRESS,
  ENTRYPOINT_ABI,
  signer
);

async function runBundlerLoop() {
  setInterval(async () => {
    const ops = getMempool();
    if (!ops.length) return;

    try {
      console.log(`📦 Bundling ${ops.length} UserOps...`);

      const tx = await entryPoint.handleOps(ops, signer.address, {
        gasLimit: 7000000,
      });

      await tx.wait();
      console.log("✅ handleOps transaction sent:", tx.hash);

      // ✅ Notify each dev after success
      for (const op of ops) {
        try {
          await notifyDev(tx.hash, op); // 💥 Notify per op
        } catch (err) {
          console.error("⚠️ Webhook notify failed:", err.message);
        }
      }

      clearMempool();
    } catch (err) {
      console.error("❌ handleOps error:", err.message);
    }
  }, 8000);
}

module.exports = { runBundlerLoop };
