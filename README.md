# ⚡ Daily Dexora – Gasless Transaction Infrastructure for Daily Network

> **Production-ready Biconomy-style stack for EVM-based gasless applications.**

Daily Dexora is a powerful infrastructure layer enabling gasless transactions, smart wallet abstraction (EIP-4337), developer onboarding, usage metering, and webhook-based automation — tailored for the **Daily Network** (EVM compatible chain).

---

## 🌐 Features

- ✅ **Smart Wallet Support** (EIP-4337 compatible)
- ✅ **Bundler Service** (Queue + Sign + Relay UserOps)
- ✅ **Paymaster Engine** (Freemium, rate limits, whitelisting)
- ✅ **Stripe-Integrated Billing** (Dynamic plan management)
- ✅ **Admin Panel** (Plans, developers, project control)
- ✅ **Redis-backed API Key System**
- ✅ **React Developer Dashboard** (Project, Bundler, Tx History, etc.)
- ✅ **Firebase Auth** (Google & GitHub login)
- ✅ **Platform Kill-Switch** (Emergency stop support)
- ✅ **Webhook Support** (Notify dApps on tx confirmation)

---

## 🧱 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | React.js + TailwindCSS |
| Backend      | Node.js (Express)  |
| Auth + Plans | Redis, Firebase    |
| Billing      | Stripe             |
| Indexing     | PostgreSQL         |
| Blockchain   | Solidity, Truffle  |

---

## 📁 Project Structure

/contracts → Smart contracts (EIP-4337, Paymaster, Factory)
/dashboard → Dev-facing React app
/auth → Express backend (auth, api key, plans)
/bundler → Bundler queue + relay service
/paymaster → Gas sponsorship logic (Redis-backed)
/indexer → Transaction logger (PostgreSQL)
/admin-panel → Full admin interface (React CRA)
/sdk → JS SDK for UserOps

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/your-org/daily-dexora.git
cd daily-dexora
Set Up Environment Files

Each service (auth, bundler, paymaster, dashboard) requires its own .env. Sample templates provided as .env.example.

Install Dependencies

bash
Copy
Edit
# For backend services
cd auth && npm install
cd ../bundler && npm install
cd ../paymaster && npm install

# For frontend
cd ../dashboard && npm install
cd ../admin-panel && npm install
Run in Development (Localhost)

bash
Copy
Edit
# Start services
npm run dev  # or nodemon

# Start frontend
cd dashboard && npm start
cd admin-panel && npm start
🔐 Environment Variables (Overview)
Service	Variables Needed
All Backends	REDIS_URL, PORT
Auth	STRIPE_SECRET_KEY, FIREBASE_CONFIG, ADMIN_EMAILS
Paymaster	ENTRYPOINT_ADDRESS, REDIS_URL
Dashboard	REACT_APP_API_KEY, REACT_APP_RPC_URL
SDK	LocalStorage-driven projectId, apiKey

📦 Contracts Deployment
Deployed initially to Sepolia for testing. Ready for Daily Network deployment.

Contracts:

SmartWallet.sol

EntryPoint.sol

Paymaster.sol

WalletFactory.sol

Use Truffle/Hardhat for deployment. Post-deploy, update .env across services with:

ini
Copy
Edit
ENTRYPOINT_ADDRESS=...
PAYMASTER_ADDRESS=...
WALLET_FACTORY=...
📊 Admin Dashboard
URL: http://localhost:3001

Manage:

👨‍💻 Developers

📦 Plans (create, delete, update)

🧱 Platform (stop/resume)

📊 Project credits + usage

💳 Billing Logic
Uses Stripe Checkout + Webhooks

Plans are stored in Redis

Devs can subscribe dynamically to any available plan

Example:

json
Copy
Edit
{
  "name": "Pro",
  "price": 20,
  "currency": "usd",
  "txLimit": 10000
}
✨ Live Services Overview
Service	Dev Port
Dashboard	3000
Admin Panel	3001
Auth API	5001
Bundler API	4000
Paymaster API	5002

📬 Webhook Format
If developer has webhook configured:

json
Copy
Edit
POST /webhook
{
  "txHash": "0x...",
  "sender": "0x...",
  "projectId": "abc123",
  "status": "completed",
  "timestamp": 1689990000
}
🛡️ Security Notes
All API Keys stored in Redis

Platform-level emergency toggle via admin panel

Block developers manually via admin panel or Redis

👨‍🔬 Contributors
Project Architect: {Ahsan Moizz}

GitHub: https://github.com/ahsanmoizz

Blockchain Stack, Full Admin UI, and SDK contributor

📌 License
MIT — Designed for production systems, forks welcome with credit.

