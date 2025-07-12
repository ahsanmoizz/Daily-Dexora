import express from "express";
import { v4 as uuid } from "uuid";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);

// Add new bundler
router.post("/", async (req, res) => {
  const { url, projectId, devId } = req.body;
  const id = uuid();

  const bundler = {
    id,
    url,
    projectId,
    devId,
  };

  await redis.hset(`bundler:${id}`, bundler);
  await redis.sadd(`bundlers:${projectId}`, id);
  res.json(bundler);
});

// Get bundlers for project
router.get("/:projectId", async (req, res) => {
  const ids = await redis.smembers(`bundlers:${req.params.projectId}`);
  const bundlers = [];

  for (const id of ids) {
    const data = await redis.hgetall(`bundler:${id}`);
    bundlers.push(data);
  }

  res.json(bundlers);
});

export default router;
