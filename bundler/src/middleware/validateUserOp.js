function validateUserOpSchema(op) {
  const requiredFields = ["sender", "callData", "nonce", "signature", "callGasLimit", "verificationGasLimit", "preVerificationGas", "maxFeePerGas", "maxPriorityFeePerGas"];
  for (let field of requiredFields) {
    if (!op[field]) return { valid: false, message: `Missing field: ${field}` };
  }
  return { valid: true };
}
module.exports = { validateUserOpSchema };
