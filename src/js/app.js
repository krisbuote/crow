App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

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

  initContract: function() {
    $.getJSON("TruthStake.json", function(TruthStake) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.TruthStake = TruffleContract(TruthStake);
      // Connect provider to interact with contract
      App.contracts.TruthStake.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.TruthStake.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
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

  render: function() {
    var TruthStakeInstance;
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

    loader.hide();
    content.show();

    // Load contract data
    App.contracts.TruthStake.deployed().then(function(instance) {
     TruthStakeInstance = instance;
      return TruthStakeInstance.statement();
    }).then(function(statement) {
      // var stakedStatement = $("#stakedStatement");
      // stakedStatement.empty();
      // stakedStatement.append(stakedStatement)
      $("#stakedStatement").html("Statement: " + statement);

      // Position select menu
      var positionSelect = $("#positionSelect");
      positionSelect.empty();
      var chooseTrue = "<option value='1'> True </ option>"
      var chooseFalse = "<option value='0'> False </ option>"
      positionSelect.append(chooseTrue);
      positionSelect.append(chooseFalse);

      return TruthStakeInstance.totalPot();
    }).then(function(pot) {
      $("pot").html(pot);
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });


  },




  makeStake: function() {
    var position = $("#positionSelect").val();
    var stakeValue = $("#stakeValue").val();
    App.contracts.TruthStake.deployed().then(function(instance) {
      TruthStakeInstance = instance;
      return TruthStakeInstance.stake(position, { from: App.account, value:stakeValue*10**18 });
    }).then(function(result) {
      // Wait for stake total to update
      content.hide();
      loader.show();
    }).catch(function(err) {
      console.error(err);
    });
  }

};



//   castVote: function() {
//     var candidateId = $('#candidatesSelect').val();
//     App.contracts.TruthStake.deployed().then(function(instance) {
//       return instance.vote(candidateId, { from: App.account });
//     }).then(function(result) {
//       // Wait for votes to update
//       $("#content").hide();
//       $("#loader").show();
//     }).catch(function(err) {
//       console.error(err);
//     });
//   }
// };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
