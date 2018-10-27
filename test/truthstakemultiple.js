var TruthStakeMultiple = artifacts.require("./TruthStakeMultiple.sol");

console.log('1');
// relies on Mocha and Chai packages
contract("TruthStakeMultiple", function(accounts) {
	console.log('2');
	var TruthStakeMultipleInstance;

	let wallet0 = accounts[0];
	let wallet1 = accounts[1];
	let wallet2 = accounts[2];
	let wallet3 = accounts[3];
	console.log('3');
	// beforeEach('setup contract for each test', async() => {
	// TruthStakeMultipleInstance = await TruthStakeMultiple.new(1);
	// });

	it("initializes with state vars", function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.absNumStatements();
		}).then(function(absNumStatements) {
			assert.equal(absNumStatements, 0, "absNumStatements exists and is zero");
			console.log('absNumStatements: ', absNumStatements)
			return TruthStakeMultipleInstance.absEthStaked();
		}).then(function(absEthStaked) {
			assert.equal(absEthStaked, 0, "absEthStaked exists and is zero");
			console.log('absEthStaked', absEthStaked)
		});
	});

});