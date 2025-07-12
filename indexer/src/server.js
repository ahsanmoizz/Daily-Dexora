require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 7000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(bodyParser.json());

// Save UserOp log
app.post("/userOp", async (req, res) => {
  const { sender, apiKey, status, txHash } = req.body;
  try {
    await pool.query(
      "INSERT INTO user_ops (sender, api_key, status, tx_hash) VALUES ($1, $2, $3, $4)",
      [sender, apiKey, status, txHash]
    );
    res.status(200).json({ success: true });
  } catch (e) {
    console.error("❌ DB Insert error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Get tx history by wallet
app.get("/history/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const result = await pool.query(
      "SELECT * FROM user_ops WHERE sender = $1 ORDER BY timestamp DESC LIMIT 50",
      [address]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("❌ History fetch error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Developer usage dashboard
app.get("/dev/:apiKey", async (req, res) => {
  try {
    const { apiKey } = req.params;
    const result = await pool.query(
      "SELECT COUNT(*) as total, SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful FROM user_ops WHERE api_key = $1",
      [apiKey]
    );
    res.json(result.rows[0]);
  } catch (e) {
    console.error("❌ Dev stats fetch error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Indexer API running on port ${PORT}`);
});
