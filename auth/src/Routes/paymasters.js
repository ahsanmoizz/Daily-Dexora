import express from "express";
import { v4 as uuid } from "uuid";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);

// Add a new paymaster
router.post("/", async (req, res) => {
  const { name, projectId, devId } = req.body;
  const id = uuid();

  const paymaster = {
    id,
    name,
    projectId,
    devId,
    credits: 5000,
  };

  await redis.hset(`paymaster:${id}`, paymaster);
  await redis.sadd(`paymasters:${projectId}`, id);
  res.json(paymaster);
});

// Get paymasters for a project
router.get("/:projectId", async (req, res) => {
  const ids = await redis.smembers(`paymasters:${req.params.projectId}`);
  const paymasters = [];

  for (const id of ids) {
    const data = await redis.hgetall(`paymaster:${id}`);
    paymasters.push(data);
  }

  res.json(paymasters);
});

export default router;
