require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { validateUserOp } = require("./engine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.post("/validate", async (req, res) => {
  try {
    const { userOp, apiKey } = req.body;
    const result = await validateUserOp(userOp, apiKey);
    res.status(200).send(result);
  } catch (err) {
    console.error("❌ Paymaster error:", err.message);
    res.status(400).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Redis Paymaster running on port ${PORT}`);
});
