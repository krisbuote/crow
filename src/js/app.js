App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  stakeEnded: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

// // NEW METAMASK ENABLER
//   window.addEventListener('load', async () => {
//     // Modern dapp browsers...
//     if (window.ethereum) {
//         window.web3 = new Web3(ethereum);
//         try {
//             // Request account access if needed
//             await ethereum.enable();
//             // Acccounts now exposed
//             web3.eth.sendTransaction({/* ... */});
//         } catch (error) {
//             // User denied account access...
//         }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//         window.web3 = new Web3(web3.currentProvider);
//         // Acccounts always exposed
//         web3.eth.sendTransaction({/* ... */});
//     }
//     // Non-dapp browsers...
//     else {
//         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
//     }
// });

  initContract: function() {
    $.getJSON("TruthStakeMultiple.json", function(TruthStakeMultiple) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.TruthStakeMultiple = TruffleContract(TruthStakeMultiple);
      // Connect provider to interact with contract
      App.contracts.TruthStakeMultiple.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.TruthStakeMultiple.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393

      // TODO: This will refresh the page when *anybody* stakes. Could be annoying
      instance.NewStake({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  // // Listen for events emitted from the contract
  // listenForEvents: function() {
  //   App.contracts.TruthStakeMultiple.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393

  //     // TODO: This will refresh the page when *anybody* stakes. Could be annoying
  //     instance.NewStake({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //       return instance;
  //     }).then(function(instance) {
  //       instance.NewStatement({}, {
  //         fromBlock: 0,
  //         toBlock: 'latest'
  //       }).watch(function(error, event) {
  //         console.log("NewStatement event triggered.", event)
  //         App.render();
  //       });      
  // },

  render: function() {
    var TruthStakeMultipleInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


    // Position select menu
    var positionSelect = $("#positionSelect");
    positionSelect.empty();
    var chooseTrue = "<option value='1'> True </ option>"
    var chooseFalse = "<option value='0'> False </ option>"
    positionSelect.append(chooseTrue);
    positionSelect.append(chooseFalse);

    // content.show()

    // Load contract data
    App.contracts.TruthStakeMultiple.deployed().then(function(instance) {

      TruthStakeMultipleInstance = instance;
      return TruthStakeMultipleInstance.absNumStatements();

    }).then(function(absNumStatements) {

      var statementInfo = $("#statementInfo");
      statementInfo.empty();

      // table builder 
      for (var i = 0; i <= absNumStatements; i++) {

        /////////////  BUG IN HERE /////////////////// 
        /// Adding 2 to ID for each statement created and putting a blank row. ////

        ///// Erasing table after stake made./////

        TruthStakeMultipleInstance.statements(i).then(function(statement) {
          var statementID = statement[0];
          var text = statement[1];
          var stakeEndTime = statement[2];
          var marketMaker = statement[3];
          var numStakes = statement[4];
          var stakeEnded = statement[5];
          var stakedEth;

          for (var j = 0; j <= numStakes; j++) {
            var stake = statement.stakes(j)
            stakedEth += stake[1]
          }

          var statementTemplate = "<tr><td>" + statementID + "</td><td>" + numStakes + "</td><td>" + stakedEth + "</td><td>" + text + "</td><td>" + stakeEndTime + "</td></tr>"
          statementInfo.append(statementTemplate);
        });

        /////////////// BUG END //////////////////

      }


      return TruthStakeMultipleInstance.absEthStaked();
    }).then(function(absEthStaked) {
      // Display the total amount staked.
      $("#absEthStaked").html(absEthStaked.toNumber()/10**18);
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

  },

  makeNewStatement: function() {
    var newStatementString = $("#newStatementString").val();
    var newStatementStakingPeriod = $("#newStatementStakingPeriod").val();
    App.contracts.TruthStakeMultiple.deployed().then(function(instance) {
      TruthStakeMultipleInstance = instance;
      return TruthStakeMultipleInstance.newStatement(newStatementString, newStatementStakingPeriod);

    }).then(function(result) {
      newStatementID = result;
      content.hide();
      loader.show();

    }).catch(function(err) {
      console.error(err);
    });

  },

  makeStake: function() {
    var statementIdToStake = $("#statementIdToStake").val()
    var position = $("#positionSelect").val();
    var stakeValue = $("#stakeValue").val();
    App.contracts.TruthStakeMultiple.deployed().then(function(instance) {
      TruthStakeMultipleInstance = instance;
      return TruthStakeMultipleInstance.stake(statementIdToStake, position, { from: App.account, value:stakeValue*10**18 });

    }).then(function(result) {
      // Wait for stake total to update
      content.hide();
      loader.show();

    }).catch(function(err) {
      console.error(err);
    });
  },

   endStakeNow: function() {
    App.contracts.TruthStakeMultiple.deployed().then(function(instance) {
      TruthStakeMultipleInstance = instance;
      return TruthStakeMultipleInstance.endStake()
    }).then(function(result) {
      // Wait for stake total to update
      content.hide();
      loader.show();

    }).catch(function(err) {
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
