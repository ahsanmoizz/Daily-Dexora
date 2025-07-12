import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import Redis from "ioredis";

// ⛓ Route imports (ESM syntax)
import upgradeRoutes from "./src/upgrade.js";
import adminRoutes from "./src/Routes/admin.js";
import projectRoutes from "./src/Routes/projects.js";
import paymasterRoutes from "./src/Routes/paymasters.js";
import bundlerRoutes from "./src/Routes/bundlers.js";

const app = express();
const redis = new Redis(process.env.REDIS_URL);
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// 🛣 Routes
app.use("/projects", projectRoutes);
app.use("/paymasters", paymasterRoutes);
app.use("/bundlers", bundlerRoutes);
app.use(upgradeRoutes);
app.use(adminRoutes);

// ✅ Dev registration or login
app.post("/auth", async (req, res) => {
  const { email, wallet } = req.body;
  if (!email && !wallet) return res.status(400).json({ error: "Email or wallet required" });

  const id = email || wallet;
  const key = `dev:${id}`;
  let apiKey = await redis.hget(key, "apiKey");

  if (!apiKey) {
    apiKey = "dev_" + uuidv4();
    await redis.hmset(key, {
      apiKey,
      plan: "free",
      usage: 0,
      email: email || "",
      wallet: wallet || "",
    });
  }

  const devData = await redis.hgetall(key);
  res.json({
    email: email || null,
    wallet: wallet || null,
    apiKey: devData.apiKey,
    plan: devData.plan,
  });
});

// ✅ Account info
app.get("/account/:id", async (req, res) => {
  const id = req.params.id;
  const devData = await redis.hgetall(`dev:${id}`);
  if (!devData.apiKey) return res.status(404).json({ error: "Developer not found" });

  res.json(devData);
});

app.listen(PORT, () => {
  console.log(`🔐 Auth/API system running on http://localhost:${PORT}`);
});
