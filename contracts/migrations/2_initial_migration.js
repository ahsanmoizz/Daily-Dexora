const EntryPoint = artifacts.require("EntryPoint");

module.exports = async function (deployer) {
  await deployer.deploy(EntryPoint);
  const instance = await EntryPoint.deployed();
  console.log("✅ EntryPoint deployed at:", instance.address);
};
