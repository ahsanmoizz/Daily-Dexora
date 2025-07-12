const EntryPoint = artifacts.require("EntryPoint");
const SmartWallet = artifacts.require("SmartWallet");

module.exports = async function (deployer, network, accounts) {
  const entryPoint = await EntryPoint.deployed();
  const owner = accounts[0];

  await deployer.deploy(SmartWallet, entryPoint.address, owner);
  const wallet = await SmartWallet.deployed();
  console.log("✅ SmartWallet deployed at:", wallet.address);
};
