var TruthStake = artifacts.require("./TruthStake.sol");
var OddEven = artifacts.require("./OddEven.sol");
var Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
	// Place constructor arguments: deployer.deploy(contractName, arg1, arg2,...);
  deployer.deploy(TruthStake, "The current year is 2018.", 10);
  deployer.deploy(OddEven);
  deployer.deploy(Election);
};
