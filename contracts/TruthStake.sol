pragma solidity 0.4.2;

contract TruthStake {
	// Create a pot that tracks Ether staked on True (T) vs. False (F)
	// Must keep sub-pots private, but totalPot value should be public
	uint TPot; // can be viewed but not modified externally?
	uint FPot;
	uint totalPot;

	// Keep track of:
	// Addresses, how much was staked by each address,  and on which position (T or F)
	struct Staker {
		// TODO: Consider using string instead of bool; consider probabilistic staking
		uint index; // index of stake
		address addr; // Staker's address
		uint stake; // Value staked
		bool choice; // Staker's choice (true or false)
	}

	// struct Stake {} 	// Create struct Stake instead of storing in Staker?
    // Stake[] public stakes; 	// A dynamically-sized array of `Stake` structs.

    // A mapping from their stakeIndex to Staker struct
	mapping(uint => Staker) public stakers; // TODO: What happens if staker stakes more than once? Use stakeIndex?
	uint public stakeIndex;


	// Constructor for the first stake on a new statement
	constructor (string memory _statement, bool _choice) public payable {
		// Require Minimum stake threshold
		require(msg.value > 0, "Insufficient value staked.")

		// keep address of contract creator
		address marketMaker = msg.sender;

		// Set variables
		stakeIndex = 0;
		TPot = 0;
		FPot = 0;
		totalPot = 0;

		// do something with _statement

		// Initial stake
		stake(_choice);
	}

	function stake(bool _choice) public payable{ 
		// Minimum stake threshold
		require(msg.value > 0, "Insufficient value staked."); 

		// Only allow single stake per address for now
		// TODO: Consider combining multiple stakes from same address as a single Staker
		// require(!stakers[msg.sender], "This address has already staked.") // This is only necessary if mapping (address => stakers)

		// Add Staker
		// stakers[msg.sender] = Staker(stakeIndex, msg.sender, msg.value, _choice); // This is only necessary if mapping (address => stakers)
		stakers[stakeIndex] = Staker(stakeIndex, msg.sender, msg.value, _choice);
		stakeIndex++;

		// Add the stake to total pot
		addToPot(msg.value, _choice);

	}

	function addToPot(uint _value, bool _choice) private {
		// TODO: Ensure the privacy of this!
		// Store the pot's values for later
		totalPot += _value;

		if (_choice == true) {
			TPot += _value;
		}
		else {
			FPot += _value;
		}
	}


	function endStake() public {
		// Temporary function to simulate stake ending

		bool winningPosition;
		// find majority position
		if ( TPot >= FPot ) {
			winningPosition = true;
		}
		else {
			winningPosition = false;
		}

		// distribute pot between winners, proportional to their stake
		distribute(winningPosition);
	}

	function distribute(bool _winningPosition) payable private {
		// for (address addr = marketMaker; addr ) // Loop through addresses somehow instead?

		// Loop through stakers, distribute their money
		for (uint i = 0; i = stakeIndex; i++) {

			staker = stakers[i];
			uint stakerProportion;
			uint reward; // CHECK math and rounding here
			uint reward; // CHECK math and rounding here

			// If the staker's position matched the majority
			// They receive their original stake + proportion of loser's stakes
			if (staker.choice == _winningPosition) {
				// If the majority staked on true
				if (_winningPosition == true) {
					profit = staker.stake / TPot * FPot 
				}
				// If the majority staked on false
				else {
					profit = staker.stake / FPot * TPot
				}
				// Their reward is original stake + profit
				reward = staker.stake + profit
			}
		}
	}

	// Need Time Lock

}
