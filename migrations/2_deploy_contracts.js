var TruthStakeMultiple = artifacts.require("./TruthStakeMultiple.sol");
var TruthStake = artifacts.require("./TruthStake.sol");
// var OddEven = artifacts.require("./OddEven.sol");
// var Election = artifacts.require("./Election.sol");


module.exports = function(deployer) {
	// Place constructor arguments: deployer.deploy(contractName, arg1, arg2,...);
  	deployer.deploy(TruthStakeMultiple);
  	deployer.deploy(TruthStake, "Test", 30*60);
  	// deployer.deploy(OddEven);
  	// deployer.deploy(Election);

};
