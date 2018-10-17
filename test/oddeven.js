var OddEven = artifacts.require("./OddEven.sol");

// relies on Mocha and Chai packages
contract("OddEven", function(accounts) {
	var OddEvenInstance;

	it("lets player 1 play", function() {
		return OddEven.deployed().then(function(instance) {
			OddEvenInstance = instance;
			return OddEvenInstance.play(7, {from:accounts[4], value:10**18});


		});

	});

	// it("lets player 2 play", function(instance) {
	// 	OddEvenInstance = instance;
	// 	return OddEvenInstance.play(5)
	// })

});