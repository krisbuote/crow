// Author: Kristopher Buote
// This contract enables people to stake Ether on a statment being true or false. 
// Winnings are distributed automatically as determined by majority stake at the end of staking round.
// ***** WORK IN PROGRESS *****

pragma solidity ^0.4.2;

contract TruthStake {
	// Create a pot that tracks Ether staked on True (T) vs. False (F)
	// Must keep sub-pots private, but totalPot value should be public
	uint public TPot; // can be viewed but not modified externally?
	uint public FPot;
	uint public totalPot;
	uint public stakeIndex;
	address public marketMaker;
	string public statement;
	uint public stakeEndTime;
	bool public stakeEnded;

	// Keep track of:
	// Addresses, how much was staked by each address,  and on which position (T or F)
	struct Staker {
		// consider probabilistic staking
		uint index; // index of stake
		address addr; // Staker's address
		uint stake; // Value staked
		uint position; // Staker's position (1 true or 0 false)
	}

	// struct Stake {} 	// Create struct Stake instead of storing in Staker?
    // Stake[] public stakes; 	// A dynamically-sized array of `Stake` structs.

    // A mapping from their stakeIndex to Staker struct
	mapping(uint => Staker) private stakers; // TODO: What happens if staker stakes more than once? Use stakeIndex?


    // Events that will be emitted on changes.
    event NewStake(uint amount);
    event StakeEnded(uint finalPot);
    event CurrentPot(uint contractBalance);
    event MajorityStaked(uint position);
    event CorrectStaker(uint stakerIndex, address stakerAddr, uint stakerStake, uint stakerPosition);
   	event StatementStaked(string statement);


	// Constructor for the first stake on a new statement
	constructor (string _statement, uint _stakingTime) public {
		
		// Constructed with nonempty string
		require(bytes(_statement).length > 0, "Constructor Argument test");

		// Set the end time for stake
		stakeEndTime = now + _stakingTime;

		// do something with _statement
		statement = _statement;
		emit StatementStaked(statement);

		// keep address of contract creator
		marketMaker = msg.sender;

		// TODO: Consider Initial Stake with constructor?
		// stake(_position);

	}

	function stake(uint _position) public payable { 

	    // Revert the call if the staking period is over or if insufficient value transacted
        require(now <= stakeEndTime, "Stake already ended.");
		require(msg.value > 0, "Insufficient stake value."); 

		// Add Staker
		// If a stake is made in constructor(), swap the order of stakeIndex++ and stakers[]
		// and ADD one to the for loop in distribute()
		stakers[stakeIndex] = Staker(stakeIndex, msg.sender, msg.value, _position);
		stakeIndex++;

		emit NewStake(msg.value);

		// Add the stake to total pot
		addToPot(msg.value, _position);

	}

	function addToPot(uint _amount, uint _position) private {
		// TODO: Ensure the privacy of this!
		// Store the pot's values for later
		totalPot += _amount;

		if (_position == 1) {
			TPot += _amount;
		}
		else {
			FPot += _amount;
		}

		emit CurrentPot(address(this).balance);

	}


	function endStake() public {
		// 1. Conditions
		// Require that sufficient time has passed and endStake has not already been called
		require(now >= stakeEndTime, "There is still staking time remaining.");
		require(!stakeEnded, "endStake has already been called.");

		// 2. Effects
		stakeEnded = true;
		uint winningPosition;

		// find majority position. TODO: Handle ties.
		if ( TPot >= FPot ) {
			winningPosition = 1;
		}
		else {
			winningPosition = 0;
		}

		// Emit the total pot value and winning position at end of stake
		emit StakeEnded(totalPot);
		emit MajorityStaked(winningPosition);

		// 3. Interactions
		// distribute pot between winners, proportional to their stake
		distribute(winningPosition);

		// require(address(this).balance == 0, "There is ether remaining in the contract!");


	}


	// Events for debugging
	event LoopCheck(uint loopNumber);
	event StakerCheck(uint stakersIndex);
	event IndexCheck(uint currentStakeIndex);
	event RewardCheck(uint rewardTransfered);
	event ProfitCheck(uint profitCalculated);
	event PotsCheck(uint TPotValue, uint FPotValue);

	function distribute(uint _winningPosition) private {
		// for (address addr = marketMaker; addr ) // Loop through addresses somehow instead?

		// TEST send all money to msg.sender
		// msg.sender.transfer(address(this).balance);
		uint profit; // CHECK math and rounding here
		uint reward; // CHECK math and rounding here

		emit CurrentPot(address(this).balance);
		emit IndexCheck(stakeIndex);

		// Loop through stakers, distribute their money
		// Confirm i < stakeIndex is correct 
		for (uint i = 0; i < stakeIndex; i++) {

			// emit StakerCheck(stakers[i].index);
			// emit LoopCheck(i);

			// If the staker's position matched the majority
			// They receive their original stake + proportion of loser's stakes
			if (stakers[i].position == _winningPosition) {

				// Profit = (proportion of correct pot staked) * (opposition's pot) 
				// !! WARNING: AVOID ROUNDING -- multiply first!!
				emit CorrectStaker(stakers[i].index, stakers[i].addr, stakers[i].stake, stakers[i].position);
				
				// If the majority staked on true
				if (_winningPosition == 1) {
					profit = stakers[i].stake * FPot / TPot; 
				}

				// If the majority staked on false
				else {
					profit = stakers[i].stake * TPot / FPot;
				}

				emit ProfitCheck(profit);

				// Their reward is original stake + profit
				reward = stakers[i].stake + profit;
				emit RewardCheck(reward);

				// Send the winner their reward
				stakers[i].addr.transfer(reward);
			}

		}

		// Reset the game
		stakeIndex = 0;
		TPot = 0;
		FPot = 0;
		totalPot = 0;
		emit IndexCheck(stakeIndex);
		emit CurrentPot(address(this).balance);		
		emit StatementStaked(statement);



	}


}
