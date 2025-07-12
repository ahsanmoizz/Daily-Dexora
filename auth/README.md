# Developer Auth + API Key Issuance

## 🔐 Endpoints

### `POST /auth`

Request:
```json
{
  "email": "dev@gmail.com"
  // or
  "wallet": "0x123..."
}
```

Response:
```json
{
  "email": "dev@gmail.com",
  "apiKey": "dev_xxxx",
  "plan": "free"
}
```

### `GET /account/:id`

- Use email or wallet as ID

## 🛠 Redis Keys

| Redis Key            | Format              |
|----------------------|---------------------|
| `dev:<id>`           | Hash: apiKey, plan  |
