var TruthStake = artifacts.require("./TruthStake.sol");

// relies on Mocha and Chai packages
contract("TruthStake", function(accounts) {
	var TruthStakeInstance;

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


	it("allows stake on 1 from:addr[8], value:1eth", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(1, {from:web3.eth.accounts[8], value:1*10**18});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStake", "the event type is correct");
		});
	});

	it("allows stake on 0 from:addr[9], value:1eth", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(0, {from:web3.eth.accounts[9], value:1.5*10**18});
			}).then(function(result) {
			assert.equal(result.logs.length, 2, "correct number of events triggered");
			assert.equal(result.logs[0].event, "NewStake", "the event type is correct");
		});
	});

	it("allows stake on 1 from:addr[7], value:1eth", function() {
		return TruthStake.deployed().then(function(instance) {
			TruthStakeInstance = instance;
			return TruthStakeInstance.stake(1, {from:web3.eth.accounts[7], value:2*10**18});
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
			return TruthStakeInstance.endStake({from:web3.eth.accounts[0]});
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
});