# Production SDK for Daily Biconomy Clone

This SDK is production-ready and used to:
- Sign and build EIP-4337 UserOperations
- Deploy smart contract wallets
- Submit operations to your bundler
- Support plug-and-play paymaster modules

## Installation

```bash
npm install ethers axios dotenv
```

## Example Usage

```js
const sdk = require("./sdk/src");
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet("0xYourPrivateKey", provider);

const callData = "0x";
const nonce = "0x0";

(async () => {
  const userOp = await sdk.createSignedUserOp(wallet, callData, nonce);
  const result = await sdk.sendUserOperation(userOp);
  console.log("Bundler Response:", result);
})();
