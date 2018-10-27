# Crow Truth Staking DApp

A decentralized application that allows the crowd to stake money on the truthfulness of claims made by the media.

--- WORK IN PROGRESS ---

## Requirements
+ [node](https://nodejs.org/en/)
+ [truffle](https://www.npmjs.com/package/truffle)
+ [ganache](https://truffleframework.com/ganache)
+ [metamask](https://metamask.io/)


## Documentation

0. Install Ganache, truffle, node, metamask

1. To get working full-stack template: $truffle unbox pet-shop 
2. To compile smart contracts and build the .json: $truffle compile
3. have ganache open
4. To launch smart contract, you will be using the javascript files in /migrations/. Adjust code for any new smart contract file names.
4.1 If your contract constructor takes arguments, place them in the deployer
5. Initial migration of code to blockchain instance (running with Ganache): $truffle migrate
6. If you change your smart contract code and want to update: $truffle migrate --reset // note this will reset everything
7. interact with the smart contract from console with: $truffle console
8. Once in console, enter $contractName.deployed().then(function(i) { app = i; }) // this should return 'undefined'
9. Call contract functions with app.functionName(x,y,z, { from : 0x123..., value : 10 }) // {} contains metadata for the function
10. View blockchain stuff with $web3.eth.X . $web3.eth.accounts returns account addresses in Ganache
11. Use contractname.js in /tests/ to test the contract in action using Mocha and Chai it(...) tests

### General troubleshooting
+ if making a transaction with metamask and tx nonce is mismatched from ganache network's tx nonce, reset your account in metamask:
https://consensys.zendesk.com/hc/en-us/articles/360004177531-Resetting-an-Account-New-UI-

### Sample Prototype
![prototype web interface](https://github.com/krisbuote/crow/blob/multiple_staking/src/images/prototype_interface.PNG "Staking.")
