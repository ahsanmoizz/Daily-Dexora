# Production Bundler for Daily Network

This is a secure, production-ready EIP-4337 bundler.
- Validates signature and input
- Sends batches via handleOps()
- Mempool support
- PM2 and Docker ready

## Usage

```bash
npm install
cp .env.example .env
node src/index.js
```

Or in production:
```bash
pm2 start ecosystem.config.js
```
