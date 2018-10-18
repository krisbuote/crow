var TruthStake = artifacts.require("./TruthStake.sol");

module.exports = function(deployer) {
	// Place constructor arguments: deployer.deploy(contractName, arg1, arg2,...);
  deployer.deploy(TruthStake, "Donald Trump is the current President of the United States.", 60*60);
};
