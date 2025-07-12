const { ethers } = require("ethers");
async function fetchSmartWalletNonce(walletAddress, abi, provider) {
  const walletContract = new ethers.Contract(walletAddress, abi, provider);
  return await walletContract.nonce();
}
module.exports = { fetchSmartWalletNonce };
