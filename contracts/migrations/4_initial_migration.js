const EntryPoint = artifacts.require("EntryPoint");
const WalletFactory = artifacts.require("WalletFactory");

module.exports = async function (deployer) {
  const entryPoint = await EntryPoint.deployed();
  await deployer.deploy(WalletFactory, entryPoint.address);
  const factory = await WalletFactory.deployed();
  console.log("✅ WalletFactory deployed at:", factory.address);
};
