// Author: Kristopher Buote
// This contract enables people to stake Ether on a statment being true or false. 
// Winnings are distributed automatically as determined by majority stake at the end of staking round.
// ***** WORK IN PROGRESS *****

pragma solidity ^0.4.2;

contract TruthStakeMultiple {
	// Create a pot that tracks Ether staked on True (T) vs. False (F)
	// Must keep sub-pots private, but totalPot value should be public

	struct Statement {
		uint id;
		string statement;
		uint stakeEndTime;
		address marketMaker;
		uint numStakes;
		bool stakeEnded;
		mapping(uint => Stake) stakes;
	}

	// Keep track of:
	// Addresses, how much was staked by each address,  and on which position (T or F)
	struct Stake {
		// consider probabilistic staking
		address addr; // Staker's address
		uint amount; // Value staked
		uint position; // Staker's position (1 true or 0 false)
	}

	struct Pot {
		uint total;
		uint T;
		uint F;
	}

	mapping(uint => Statement) statements; 
	mapping(uint => Pot) private pots;  /////////// TODO: Put pot mapping in statement too?

	// State Variables
	uint public absNumStatements;
	uint public absNumStakes;
	uint public absEthStaked;

    // Events that will be emitted on changes.
    event NewStake(uint statementID, uint amount);
    event StakeEnded(uint finalPot);
    event CurrentPot(uint statementID, uint potBalance);
    event MajorityStaked(uint position);
   	event NewStatement(string statement, uint stakeEndTime);

   	// Events for debugging
   	event CorrectStake(uint statementID, address stakerAddr, uint amount, uint stakedPosition);
	event LoopCheck(uint loopNumber);
	event StatementIDCheck(uint statementID); /// CHECK
	event RewardCheck(uint rewardTransfered);
	event ProfitCheck(uint profitCalculated);
	event PotsCheck(uint TPotValue, uint FPotValue);


	// Constructor executes once when contract is created
	// constructor () public {
	// 	newStatement("This statement is false", 1325000000);
	// }

	function newStatement(string _statement, uint _stakingTime) public returns(uint statementID) {
		require(bytes(_statement).length > 0, "requires bytes(statement) > 0. Possibly empty string given.");

		uint stakeEndTime;

		stakeEndTime = now + _stakingTime;
		statementID = absNumStatements++; //sets statementID and THEN increases absNumStatements by 1
		statements[statementID] = Statement(statementID, _statement, stakeEndTime, msg.sender, 0, false);
		pots[statementID] = Pot(0, 0, 0);

		// Add to global statement count 
		absNumStatements++;

		emit NewStatement(_statement, stakeEndTime);
	}

	function stake(uint _statementID, uint _position) public payable { // returns( ) necessary? 

	    // Revert the call if the staking period is over or if insufficient value transacted
		require(msg.value > 0, "Insufficient stake value.");
		//// TODO: require(address exists)?
		require(_position == 0 || _position == 1, "Invalid position to stake on."); 
		require(_statementID < absNumStatements && _statementID >= 0, "Invalid Statement ID.");

		Statement storage s = statements[_statementID];
		require(now <= s.stakeEndTime, "Stake already ended for this statement.");

		// Map Stake with statement
		s.stakes[s.numStakes++] = Stake({addr:msg.sender, amount:msg.value, position:_position});

		// Add the stake to total pot
		addToPot(msg.value, _position, _statementID);
		emit NewStake(_statementID, msg.value);

		// Add to global trackers
		absNumStakes++;
		absEthStaked += msg.value;

	}

	function addToPot(uint _amount, uint _position, uint _statementID) private {

		Pot storage p = pots[_statementID];
		p.total += _amount;

		/// TODO: Consider using bool _position , not uint /// 
		if (_position == 1) {
			p.T += _amount;
		}
		else {
			p.F += _amount;
		}

		emit CurrentPot(_statementID, p.total);

	}

	function endStake(uint _statementID) public {

		// TODO: storage or memory???
		Statement memory s = statements[_statementID];

		// 1. Conditions
		// Require that sufficient time has passed and endStake has not already been called
		require(now >= s.stakeEndTime, "There is still staking time remaining.");
		require(!s.stakeEnded, "endStake has already been called.");

		// 2. Effects
		s.stakeEnded = true;
		uint winningPosition;

		// find majority position. TODO: Handle ties.
		Pot memory p = pots[_statementID];

		// If the majority staked on true
		if ( p.T >= p.F ) {
			winningPosition = 1;
		}
		else {
			winningPosition = 0;
		}

		// Emit the total pot value and winning position at end of stake
		emit StakeEnded(p.total);
		emit MajorityStaked(winningPosition);

		// 3. Interactions
		// distribute pot between winners, proportional to their stake
		distribute(_statementID, winningPosition);
	}

	// TODO: Consider a withdraw function rather than automated distribution

	function distribute(uint _statementID, uint _winningPosition) private {

		uint profit; // CHECK math and rounding here
		uint reward; // CHECK math and rounding here
		uint TPot;
		uint FPot;


		// TODO storage or memory?
		Statement storage s = statements[_statementID];
		Pot memory p = pots[_statementID];
		emit CurrentPot(_statementID, p.total);

		TPot = p.T;
		FPot = p.F;

		// Loop through stakes, distribute their money
		// Confirm i < stakeIndex is correct 
		for (uint i = 0; i < s.numStakes; i++) {

			// emit LoopCheck(i);

			// If the staker's position matched the majority
			// They receive their original stake + proportion of loser's stakes
			if (s.stakes[i].position == _winningPosition) {

				// Profit = (proportion of correct pot staked) * (opposition's pot) 
				// emit CorrectStake(_statementID, s.stakes[i].addr, s.stakes[i].stake, s.stakes[i].position);
				
				// If the majority staked on true
				if (_winningPosition == 1) {
					profit = s.stakes[i].amount * FPot / TPot; // truncated at singular Wei level if odd
				}
				else {
					profit = s.stakes[i].amount * TPot / FPot;
				}

				emit ProfitCheck(profit);

				// Their reward is original stake + profit
				reward = s.stakes[i].amount + profit;
				emit RewardCheck(reward);

				// Send the winner their reward
				s.stakes[i].addr.transfer(reward);
			}

		}

	}


}
