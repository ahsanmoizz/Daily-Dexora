require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { addToMempool } = require("./mempool");
const { verifySignature } = require("./signatureVerifier");
const { runBundlerLoop } = require("./bundler");
const { validateUserOpSchema } = require("./middleware/validateUserOp");
const { setupSecurityHeaders } = require("./middleware/securityHeaders");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 10 * 1000, max: 50 }));
app.use(morgan("combined"));
app.use(bodyParser.json());
setupSecurityHeaders(app);
app.post("/userOp", async (req, res) => {
  try {
    const userOp = req.body;

    const validation = validateUserOpSchema(userOp);
    if (!validation.valid) throw new Error(validation.message);

    // ✅ Ensure metadata is present
    const { apiKey, projectId } = userOp?.metadata || {};
    if (!apiKey || !projectId) throw new Error("Missing apiKey or projectId in metadata");

    const valid = await verifySignature(userOp, userOp.sender, userOp.sender);
    if (!valid) throw new Error("Invalid signature");

    addToMempool(userOp); // metadata preserved
    res.status(200).json({ status: "queued" });
  } catch (err) {
    console.error("❌ /userOp error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.get("/status", (req, res) => {
  res.status(200).json({ status: "Bundler is running" });
});

runBundlerLoop();
app.listen(PORT, () => {
  console.log(`🛠️ Bundler listening on http://localhost:${PORT}`);
});
