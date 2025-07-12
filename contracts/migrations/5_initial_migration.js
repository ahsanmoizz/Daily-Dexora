const EntryPoint = artifacts.require("EntryPoint");
const Paymaster = artifacts.require("Paymaster");

module.exports = async function (deployer) {
  const entryPoint = await EntryPoint.deployed();
  await deployer.deploy(Paymaster, entryPoint.address);
  const paymaster = await Paymaster.deployed();
  console.log("✅ Paymaster deployed at:", paymaster.address);
};
