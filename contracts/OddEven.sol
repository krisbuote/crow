// WARNING: This is a sample contract to demonstrate the functionality. Don't use it in your project.
pragma solidity ^0.4.21;

contract OddEven {
   struct Player { 
     address addr; 
     uint number;
   }
   
   Player[2] private players;
   uint8 count = 0; 

   function play(uint number) payable public {
        require(msg.value == 1 ether);
        players[count] = Player(msg.sender, number);
        count++;
        if (count == 2) selectWinner();
   }
   
   function selectWinner() private {
        uint n = players[0].number + players[1].number;
        players[n%2].addr.transfer(address(this).balance);
        delete players;
        count = 0;
   }
 }