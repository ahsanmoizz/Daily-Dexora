const { ethers } = require("ethers");
async function verifySignature(userOp, smartWalletAddress, expectedSigner) {
  try {
    const encoded = ethers.solidityPacked(
      ["address", "bytes", "uint256"],
      [userOp.sender, userOp.callData, userOp.nonce]
    );
    const hash = ethers.keccak256(encoded);
    const recovered = ethers.verifyMessage(ethers.getBytes(hash), userOp.signature);
    return recovered.toLowerCase() === expectedSigner.toLowerCase();
  } catch (err) {
    console.error("❌ Signature verification error:", err.message);
    return false;
  }
}
module.exports = { verifySignature };
