function isSponsored(userOp) {
  return userOp.paymasterAndData !== "0x";
}
module.exports = { isSponsored };
