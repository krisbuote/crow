var TruthStakeMultiple = artifacts.require("./TruthStakeMultiple.sol");

// relies on Mocha and Chai packages
contract("TruthStakeMultiple", function(accounts) {
	var TruthStakeMultipleInstance;

	let wallet0 = accounts[0];
	let wallet1 = accounts[1];
	let wallet2 = accounts[2];
	let wallet3 = accounts[3];
	// beforeEach('setup contract for each test', async() => {
	// TruthStakeMultipleInstance = await TruthStakeMultiple.new(1);
	// });

	it("initializes with state vars", function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.absNumStatements();
		}).then(function(absNumStatements) {
			assert.equal(absNumStatements.toNumber(), 0, "absNumStatements exists");
			console.log('absNumStatements: ', absNumStatements);
			return TruthStakeMultipleInstance.absEthStaked();
		}).then(function(absEthStaked) {
			assert.equal(absEthStaked.toNumber(), 0, "absEthStaked exists and is zero");
			console.log('absEthStaked', absEthStaked);
		});
	});

	it('allows new statement creation', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.newStatement("New Statement 1", 36000);
			}).then(function(result) {
			assert.equal(result.logs.length, 1, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStatement", "the event type is correct");
		});

	});

	it('allows new statement creation2', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.newStatement("New statement2", 46000);
			}).then(function(result) {
			assert.equal(result.logs.length, 1, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStatement", "the event type is correct");
		});

	});

	it("checks absNumStatements", function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.absNumStatements();
			}).then(function(absNumStatements) {
			assert.equal(absNumStatements.toNumber(), 2, "absNumStatements equals");
			console.log('absNumStatements: ', absNumStatements);
		});
	});

	it('allows new stake on valid statementID', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.stake(0, 1, {from:wallet1, value:69});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "CurrentPot", "the event type is correct");
			assert.equal(result.logs[1].event, "NewStake", "the event type is correct");
		});

	});

	it('disallows new stake on invalid statementID', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.stake(999, 1, {from:wallet2, value:99});
			}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
		});
	});

	it('tests variable types for statements(0)', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.statements(0);
		}).then(function(statement){
			console.log("statement variable:", statement);
			// console.log('statementID test:', statement[0].toNumber());
			// for (var i=0; i<=6;i++) {
			// 	console.log(statement[i])
			// }
		});
	});

	it('disallows access to pots', function() {
		return TruthStakeMultiple.deployed().then(function(instance) {
			TruthStakeMultipleInstance = instance;
			return TruthStakeMultipleInstance.pots(0);
			}).then(assert.fail).catch(function(error) {
			console.log(error.message)
			// assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
		});
	});




});