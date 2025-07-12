import express from "express";
import { v4 as uuid } from "uuid";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(process.env.REDIS_URL);

// Add new project
router.post("/", async (req, res) => {
  const { name, devId } = req.body;
  const id = uuid();

  const project = {
    id,
    name,
    devId,
    credits: 100000,
  };

  await redis.hset(`project:${id}`, project);
  await redis.sadd(`projects:${devId}`, id);

  res.json(project);
});

// Get all projects for a dev
router.get("/:devId", async (req, res) => {
  const ids = await redis.smembers(`projects:${req.params.devId}`);
  const projects = [];

  for (const id of ids) {
    const data = await redis.hgetall(`project:${id}`);
    projects.push(data);
  }

  res.json(projects);
});

export default router;
