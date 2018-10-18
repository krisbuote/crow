var TruthStake = artifacts.require("./TruthStake.sol");

// relies on Mocha and Chai packages
contract("TruthStake", function(accounts) {
	var TruthStakeInstance;

	let wallet0 = accounts[0];
	let wallet1 = accounts[1];
	let wallet2 = accounts[2];
	let wallet3 = accounts[3];

	// beforeEach('setup contract for each test', async() => {
	// TruthStakeInstance = await TruthStake.new(1);
	// });

	it("initializes with empty pot", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.totalPot();
		}).then(function(pot) {
			assert.equal(pot, 0, "pot exists and is empty");
			return TruthStakeInstance.stakeIndex();
		}).then(function(idx) {
			assert.equal(idx, 0, "stakeIndex is 0");
		});
	});


	it("allows stake on 1 (aka true)", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(1, {from:wallet1, value:1*10**18});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStake", "the event type is correct");
		});
	});

	it("allows stake on 0 (aka false)", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(0, {from:wallet2, value:1.5*10**18});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStake", "the event type is correct");
		});
	});

	it("allows stake on 1 (aka true)", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(1, {from:wallet3, value:2*10**18});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStake", "the event type is correct");
		});
	});

	it("has the correct amount in the pot after 3 stakes", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.totalPot();
			}).then(function(pot) {
				// console.log(pot);
				assert.equal(pot, 4.5*10**18, "correct amount in totalPot");
				return TruthStakeInstance.TPot();
			}).then(function(tpot) {
				// console.log(tpot);
				assert.equal(tpot, 3*10**18, "correct amount in TPot");
				return TruthStakeInstance.FPot();
			}).then(function(fpot) {
				// console.log(fpot);
				assert.equal(fpot, 1.5*10**18, "correct amount inFPot");
			});
	});


	it("endStake and distribute pot", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;	
			return TruthStakeInstance.endStake({from:wallet0});
			}).then(function(result) {
				// console.log(result.logs);
				assert.equal(result.logs.length, 999, "correct number of events triggered");
				assert.equal(result.logs[0].event, "StakeEnded", "the event type is correct");
			// 	return TruthStakeInstance.winningPosition();
			// }).then(function(position) {
			// 	console.log(position);
				return TruthStakeInstance.totalPot(); 
			}).then(function(pot) {
				assert.equal(pot, 0, "The total pot should be empty.");
			});

	});

	it("endStake cannot be called twice", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;	
			return TruthStakeInstance.endStake({from:wallet0});
			}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			});
	});


});