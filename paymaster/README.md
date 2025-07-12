# Redis Paymaster Engine

### ✅ Features
- API Key validation
- Freemium sponsorship (5 tx/day)
- Address whitelisting
- Fully Redis-based (no database)

### 🧪 Run Locally

```bash
npm install express body-parser dotenv ioredis
node src/index.js
```

### 🔑 Redis Keys Used

| Key Type | Format                     | Example                           |
|----------|----------------------------|-----------------------------------|
| API Keys | Set: `apiKeys`             | `SADD apiKeys dev_abc123`         |
| Usage    | `usage:<apiKey>:<date>`    | `GET usage:dev_abc123:2024-06-02` |
| Whitelist| Set: `whitelist`           | `SADD whitelist 0xYourAddress`    |
