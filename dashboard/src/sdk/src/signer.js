const { ethers } = require("ethers");
const { getPaymasterData } = require("./paymaster");

function getProjectId() {
  return localStorage.getItem("project_id");
}

async function createSignedUserOp(wallet, callData, nonce) {
  const apiKey = localStorage.getItem("api_key");
  const projectId = getProjectId();

  if (!apiKey || !projectId) throw new Error("Missing API Key or Project ID");

  const userOp = {
    sender: wallet.address,
    callData,
    nonce,
    callGasLimit: "0x100000",
    verificationGasLimit: "0x100000",
    preVerificationGas: "0x10000",
    maxFeePerGas: "0x1dcd6500",
    maxPriorityFeePerGas: "0x1dcd6500",
    paymasterAndData: "0x",
    metadata: {
      apiKey,
      projectId,
    },
  };

  userOp.paymasterAndData = await getPaymasterData(userOp);

  const packed = ethers.solidityPacked(
    ["address", "bytes", "uint256"],
    [userOp.sender, userOp.callData, userOp.nonce]
  );
  const hash = ethers.keccak256(packed);
  userOp.signature = await wallet.signMessage(ethers.getBytes(hash));

  return userOp;
}

module.exports = { createSignedUserOp };
