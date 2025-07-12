# Production Indexer

📡 Logs & exposes UserOperation activity.

## API Endpoints

- `POST /userOp`  
  Save a UserOp log entry

- `GET /history/:address`  
  Get latest 50 UserOps for a given wallet address

- `GET /dev/:apiKey`  
  Get usage summary for a developer (total + success)

## DB Setup

```sql
CREATE DATABASE indexer_db;
\c indexer_db;
-- Run schema.sql
```

## .env

```
PORT=7000
DATABASE_URL=postgresql://user:password@localhost:5432/indexer_db
```
