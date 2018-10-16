var TruthStake = artifacts.require("./TruthStake.sol");

module.exports = function(deployer) {
  deployer.deploy(TruthStake);
};
