const { ethers } = require("ethers");
const FACTORY_ABI = require("./factoryABI.json");
require("dotenv").config();

const factoryAddress = process.env.FACTORY_ADDRESS;

async function getSmartWalletAddress(userEOA, salt, provider) {
  const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, provider);
  return await factory.getAddress(userEOA, salt);
}

async function deployWalletIfNeeded(userEOA, salt, provider, signer) {
  const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);
  const walletAddress = await getSmartWalletAddress(userEOA, salt, provider);
  const code = await provider.getCode(walletAddress);
  if (code === "0x") {
    const tx = await factory.createAccount(userEOA, salt);
    await tx.wait();
    console.log("Deployed smart wallet at:", walletAddress);
  } else {
    console.log("ℹ Smart wallet already deployed at:", walletAddress);
  }
  return walletAddress;
}

module.exports = { getSmartWalletAddress, deployWalletIfNeeded };
