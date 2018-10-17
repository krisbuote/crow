pragma solidity ^0.4.2;

contract Election {
	// Model a Candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	} 

	// Store Candidates
	// Fetch Candidate
	mapping(uint => Candidate) public candidates;

	// Store accounts that have voted
	mapping(address => bool) public voters;

	// Store Candidates Count 
	uint public candidatesCount;

	// Constructor constructs the contract
	constructor () public {
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}
	
	// Voted event
	event votedEvent (
		uint indexed _candidateId
		);

	function addCandidate (string _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote (uint _candidateId) public {
		// require that the address hasn't already voted
		require(!voters[msg.sender]); // check sender Not in voters mapping

		// require the candidate exists
		require(_candidateId > 0 && _candidateId <= candidatesCount);

		// record that the voter has cast their vote
		voters[msg.sender] = true;

		// add a vote to Candidate vote count
		candidates[_candidateId].voteCount ++;

		// trigger votedEvent
		emit votedEvent(_candidateId);
	}
}